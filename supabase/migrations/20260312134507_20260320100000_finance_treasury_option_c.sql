-- ============================================================================
-- Phase 1: Finance Treasury Option C Read Models
-- File: 20260312134507_20260320100000_finance_treasury_option_c.sql
-- Description:
--   Adds Option C treasury/admin reporting views without changing ledger
--   mutation semantics. The ledger remains the source of truth; these views
--   project platform pools for admin reporting and reconciliation.
-- ============================================================================

-- ============================================================================
-- 1) ADMIN WALLET BALANCES
-- ============================================================================

DROP VIEW IF EXISTS public.vw_admin_wallet_balances CASCADE;

CREATE VIEW public.vw_admin_wallet_balances AS
WITH posted_lines AS (
    SELECT
        ll.journal_entry_id,
        ll.account_id,
        ll.direction,
        ll.amount::numeric AS amount
    FROM public.ledger_lines ll
    JOIN public.journal_entries je
      ON je.id = ll.journal_entry_id
    WHERE je.status = 'posted'
),
user_available_balances AS (
    SELECT
        a.owner_id AS user_id,
        COALESCE(SUM(
            CASE
                WHEN ll.direction = 'CREDIT'::public.ledger_direction_enum THEN ll.amount
                WHEN ll.direction = 'DEBIT'::public.ledger_direction_enum THEN -ll.amount
                ELSE 0
            END
        ), 0) AS available_balance
    FROM public.accounts a
    LEFT JOIN posted_lines ll
      ON ll.account_id = a.id
    WHERE a.account_code LIKE 'user_available:%'
      AND a.owner_id IS NOT NULL
    GROUP BY a.owner_id
),
held_balances AS (
    SELECT
        NULLIF(je.meta->>'client_id', '')::uuid AS user_id,
        COALESCE(SUM(
            CASE
                WHEN je.event_type IN ('escrow_hold', 'gateway_escrow') THEN
                    COALESCE(NULLIF(je.meta->>'amount_gross', '')::numeric, 0)
                WHEN je.event_type IN ('refund', 'release_with_fee') THEN
                    -COALESCE(
                        NULLIF(je.meta->>'gross_amount', '')::numeric,
                        NULLIF(je.meta->>'amount_gross', '')::numeric,
                        0
                    )
                ELSE 0
            END
        ), 0) AS held_balance
    FROM public.journal_entries je
    WHERE je.status = 'posted'
      AND je.event_type IN ('escrow_hold', 'gateway_escrow', 'refund', 'release_with_fee')
      AND NULLIF(je.meta->>'client_id', '') IS NOT NULL
    GROUP BY NULLIF(je.meta->>'client_id', '')::uuid
),
pending_withdrawals AS (
    SELECT
        wr.user_id,
        COALESCE(SUM(wr.amount::numeric), 0) AS pending_withdrawal_balance
    FROM public.withdrawal_requests wr
    WHERE wr.status IN ('requested', 'processing')
    GROUP BY wr.user_id
),
freelancer_payables_available AS (
    SELECT
        a.owner_id AS user_id,
        GREATEST(
            COALESCE(SUM(
                CASE
                    WHEN je.event_type IN ('release_with_fee', 'withdrawal_failed')
                     AND ll.direction = 'CREDIT'::public.ledger_direction_enum THEN ll.amount
                    ELSE 0
                END
            ), 0)
            - COALESCE(SUM(
                CASE
                    WHEN ll.direction = 'DEBIT'::public.ledger_direction_enum THEN ll.amount
                    ELSE 0
                END
            ), 0),
            0
        ) AS freelancer_payables_balance
    FROM public.accounts a
    LEFT JOIN posted_lines ll
      ON ll.account_id = a.id
    LEFT JOIN public.journal_entries je
      ON je.id = ll.journal_entry_id
    WHERE a.account_code LIKE 'user_available:%'
      AND a.owner_id IS NOT NULL
    GROUP BY a.owner_id
),
user_universe AS (
    SELECT user_id FROM user_available_balances
    UNION
    SELECT user_id FROM held_balances
    UNION
    SELECT user_id FROM pending_withdrawals
    UNION
    SELECT user_id FROM freelancer_payables_available
)
SELECT
    uu.user_id,
    'IQD'::text AS currency,
    COALESCE(uab.available_balance, 0) AS available_balance,
    COALESCE(hb.held_balance, 0) AS held_balance,
    COALESCE(pw.pending_withdrawal_balance, 0) AS pending_withdrawal_balance,
    COALESCE(fp.freelancer_payables_balance, 0) AS freelancer_payables_balance,
    GREATEST(
        COALESCE(uab.available_balance, 0) - COALESCE(fp.freelancer_payables_balance, 0),
        0
    ) AS other_wallet_liabilities_balance,
    COALESCE(p.is_wallet_frozen, false) AS is_wallet_frozen,
    NOW() AS updated_at
FROM user_universe uu
LEFT JOIN user_available_balances uab
  ON uab.user_id = uu.user_id
LEFT JOIN held_balances hb
  ON hb.user_id = uu.user_id
LEFT JOIN pending_withdrawals pw
  ON pw.user_id = uu.user_id
LEFT JOIN freelancer_payables_available fp
  ON fp.user_id = uu.user_id
LEFT JOIN public.profiles p
  ON p.id = uu.user_id;

COMMENT ON VIEW public.vw_admin_wallet_balances IS
'Admin-safe wallet balances. Uses normalized user_available balances, entity-linked held balances, operational pending withdrawal requests, and conservative release-derived freelancer payables.';

-- ============================================================================
-- 2) ADMIN WALLET ACTIVITY
-- ============================================================================

DROP VIEW IF EXISTS public.vw_admin_wallet_activity CASCADE;

CREATE VIEW public.vw_admin_wallet_activity AS
WITH user_ledger_lines AS (
    SELECT
        a.owner_id AS user_id,
        ll.id AS ledger_line_id,
        ll.journal_entry_id,
        ll.account_id,
        ll.direction,
        ll.amount::numeric AS amount,
        ll.currency
    FROM public.ledger_lines ll
    JOIN public.accounts a
      ON a.id = ll.account_id
    JOIN public.journal_entries je
      ON je.id = ll.journal_entry_id
    WHERE je.status = 'posted'
      AND a.owner_id IS NOT NULL
      AND (
          a.account_code LIKE 'user_available:%'
          OR (
              a.account_code LIKE 'user_pending_withdrawal:%'
              AND ll.direction = 'DEBIT'::public.ledger_direction_enum
          )
      )
),
user_journals AS (
    SELECT DISTINCT
        ull.user_id,
        je.id AS journal_entry_id,
        je.event_type,
        je.related_entity_type,
        je.related_entity_id,
        je.created_at,
        je.meta,
        je.currency
    FROM user_ledger_lines ull
    JOIN public.journal_entries je
      ON je.id = ull.journal_entry_id
)
SELECT
    uj.user_id,
    uj.journal_entry_id,
    uj.created_at,
    uj.event_type,
    COALESCE((
        SELECT SUM(ull.amount)
        FROM user_ledger_lines ull
        WHERE ull.user_id = uj.user_id
          AND ull.journal_entry_id = uj.journal_entry_id
    ), 0) AS amount_gross,
    COALESCE((
        SELECT SUM(
            CASE
                WHEN ull.direction = 'CREDIT'::public.ledger_direction_enum THEN ull.amount
                ELSE -ull.amount
            END
        )
        FROM user_ledger_lines ull
        WHERE ull.user_id = uj.user_id
          AND ull.journal_entry_id = uj.journal_entry_id
    ), 0) AS amount_net,
    COALESCE((
        SELECT SUM(ll.amount::numeric)
        FROM public.ledger_lines ll
        JOIN public.accounts a
          ON a.id = ll.account_id
        WHERE ll.journal_entry_id = uj.journal_entry_id
          AND a.account_code = 'platform_revenue'
    ), 0) AS fee_amount,
    uj.currency,
    uj.related_entity_type,
    uj.related_entity_id,
    CASE
        WHEN NULLIF(uj.meta->>'client_id', '')::uuid = uj.user_id THEN NULLIF(uj.meta->>'provider_id', '')::uuid
        WHEN NULLIF(uj.meta->>'provider_id', '')::uuid = uj.user_id THEN NULLIF(uj.meta->>'client_id', '')::uuid
        ELSE NULL
    END AS counterparty_user_id,
    'posted'::text AS status
FROM user_journals uj
ORDER BY uj.created_at DESC;

COMMENT ON VIEW public.vw_admin_wallet_activity IS
'Admin-safe wallet activity timeline keyed by user_id. Includes received and spent user wallet movements without relying on auth.uid().';

-- ============================================================================
-- 3) TREASURY POOL BALANCES (OPTION C)
-- ============================================================================

DROP VIEW IF EXISTS public.vw_treasury_pool_balances_realtime CASCADE;

CREATE VIEW public.vw_treasury_pool_balances_realtime AS
WITH posted_lines AS (
    SELECT
        ll.journal_entry_id,
        ll.account_id,
        ll.direction,
        ll.amount::numeric AS amount
    FROM public.ledger_lines ll
    JOIN public.journal_entries je
      ON je.id = ll.journal_entry_id
    WHERE je.status = 'posted'
),
account_balances AS (
    SELECT
        a.id AS account_id,
        a.account_code,
        a.owner_id,
        COALESCE(SUM(
            CASE
                WHEN a.account_code = 'platform_cash' THEN
                    CASE
                        WHEN ll.direction = 'DEBIT'::public.ledger_direction_enum THEN ll.amount
                        WHEN ll.direction = 'CREDIT'::public.ledger_direction_enum THEN -ll.amount
                        ELSE 0
                    END
                WHEN a.account_code = 'platform_escrow'
                  OR a.account_code = 'platform_revenue'
                  OR a.account_code LIKE 'user_available:%' THEN
                    CASE
                        WHEN ll.direction = 'CREDIT'::public.ledger_direction_enum THEN ll.amount
                        WHEN ll.direction = 'DEBIT'::public.ledger_direction_enum THEN -ll.amount
                        ELSE 0
                    END
                ELSE 0
            END
        ), 0) AS normalized_balance
    FROM public.accounts a
    LEFT JOIN posted_lines ll
      ON ll.account_id = a.id
    GROUP BY a.id, a.account_code, a.owner_id
),
held_balances AS (
    SELECT
        COALESCE(SUM(
            CASE
                WHEN je.event_type IN ('escrow_hold', 'gateway_escrow') THEN
                    COALESCE(NULLIF(je.meta->>'amount_gross', '')::numeric, 0)
                WHEN je.event_type IN ('refund', 'release_with_fee') THEN
                    -COALESCE(
                        NULLIF(je.meta->>'gross_amount', '')::numeric,
                        NULLIF(je.meta->>'amount_gross', '')::numeric,
                        0
                    )
                ELSE 0
            END
        ), 0) AS escrow_held_iqd
    FROM public.journal_entries je
    WHERE je.status = 'posted'
      AND je.event_type IN ('escrow_hold', 'gateway_escrow', 'refund', 'release_with_fee')
),
pending_withdrawals AS (
    SELECT
        COALESCE(SUM(wr.amount::numeric), 0) AS pending_payouts_iqd
    FROM public.withdrawal_requests wr
    WHERE wr.status IN ('requested', 'processing')
),
freelancer_payables_available AS (
    SELECT
        COALESCE(SUM(
            GREATEST(
                release_credits - total_debits,
                0
            )
        ), 0) AS freelancer_payables_available_iqd
    FROM (
        SELECT
            a.owner_id AS user_id,
            COALESCE(SUM(
                CASE
                    WHEN je.event_type IN ('release_with_fee', 'withdrawal_failed')
                     AND ll.direction = 'CREDIT'::public.ledger_direction_enum THEN ll.amount
                    ELSE 0
                END
            ), 0) AS release_credits,
            COALESCE(SUM(
                CASE
                    WHEN ll.direction = 'DEBIT'::public.ledger_direction_enum THEN ll.amount
                    ELSE 0
                END
            ), 0) AS total_debits
        FROM public.accounts a
        LEFT JOIN posted_lines ll
          ON ll.account_id = a.id
        LEFT JOIN public.journal_entries je
          ON je.id = ll.journal_entry_id
        WHERE a.account_code LIKE 'user_available:%'
          AND a.owner_id IS NOT NULL
        GROUP BY a.owner_id
    ) payables
),
available_user_wallets AS (
    SELECT
        COALESCE(SUM(ab.normalized_balance), 0) AS total_user_available_liabilities_iqd
    FROM account_balances ab
    WHERE ab.account_code LIKE 'user_available:%'
),
platform_balances AS (
    SELECT
        COALESCE(MAX(CASE WHEN ab.account_code = 'platform_cash' THEN ab.normalized_balance END), 0) AS platform_cash_iqd,
        COALESCE(MAX(CASE WHEN ab.account_code = 'platform_escrow' THEN ab.normalized_balance END), 0) AS escrow_account_balance_iqd,
        COALESCE(MAX(CASE WHEN ab.account_code = 'platform_revenue' THEN ab.normalized_balance END), 0) AS platform_revenue_iqd
    FROM account_balances ab
)
SELECT
    'IQD'::text AS currency,
    pb.platform_cash_iqd,
    hb.escrow_held_iqd,
    pb.escrow_account_balance_iqd,
    pb.platform_revenue_iqd,
    pb.platform_revenue_iqd AS total_fee_revenue_iqd,
    auw.total_user_available_liabilities_iqd,
    pw.pending_payouts_iqd,
    fpa.freelancer_payables_available_iqd,
    (fpa.freelancer_payables_available_iqd + pw.pending_payouts_iqd) AS freelancer_payables_total_iqd,
    GREATEST(
        auw.total_user_available_liabilities_iqd - fpa.freelancer_payables_available_iqd,
        0
    ) AS other_user_wallet_liabilities_iqd,
    (auw.total_user_available_liabilities_iqd + pw.pending_payouts_iqd) AS total_user_wallet_liabilities_iqd,
    (hb.escrow_held_iqd + auw.total_user_available_liabilities_iqd + pw.pending_payouts_iqd) AS total_platform_obligations_iqd,
    (pb.platform_cash_iqd - (hb.escrow_held_iqd + auw.total_user_available_liabilities_iqd + pw.pending_payouts_iqd)) AS actual_company_owned_cash_iqd,
    ((pb.platform_cash_iqd - (hb.escrow_held_iqd + auw.total_user_available_liabilities_iqd + pw.pending_payouts_iqd)) - pb.platform_revenue_iqd) AS reconciliation_gap_iqd,
    NOW() AS calculated_at
FROM platform_balances pb
CROSS JOIN held_balances hb
CROSS JOIN pending_withdrawals pw
CROSS JOIN freelancer_payables_available fpa
CROSS JOIN available_user_wallets auw;

COMMENT ON VIEW public.vw_treasury_pool_balances_realtime IS
'Option C treasury read model. Separates Escrow Held, release-derived Freelancer Payables, Pending Payouts, Platform Revenue, total obligations, and a diagnostic cash-basis position.';

-- ============================================================================
-- 4) ADMIN JOURNAL LEDGER (RICH TREASURY PROJECTION)
-- ============================================================================

DROP VIEW IF EXISTS public.vw_admin_journal_ledger CASCADE;

CREATE VIEW public.vw_admin_journal_ledger AS
SELECT
    je.id AS journal_id,
    je.created_at,
    je.event_type,
    je.related_entity_type,
    je.related_entity_id,
    je.related_entity_type AS entity_type,
    je.related_entity_id AS entity_id,
    je.idempotency_key,
    je.status,
    je.created_by AS initiator_user_id,
    je.meta - ARRAY[
        'psp_event_id',
        'psp_payment_id',
        'psp_request_id',
        'payment_intent_id',
        'gateway_payment_id',
        'gateway_request_id'
    ]::text[] AS meta_masked,
    je.meta AS meta_full,
    COALESCE(SUM(
        CASE
            WHEN ll.direction = 'DEBIT'::public.ledger_direction_enum THEN ll.amount::numeric
            ELSE 0
        END
    ), 0) AS gross_amount,
    COALESCE(SUM(
        CASE
            WHEN a.account_code = 'platform_revenue'
             AND ll.direction = 'CREDIT'::public.ledger_direction_enum THEN ll.amount::numeric
            ELSE 0
        END
    ), 0) AS fee_amount,
    COALESCE(SUM(
        CASE
            WHEN a.account_code LIKE 'user_available:%'
             AND ll.direction = 'CREDIT'::public.ledger_direction_enum THEN ll.amount::numeric
            ELSE 0
        END
    ), 0) AS net_amount,
    (
        ARRAY_AGG(a.owner_id ORDER BY a.owner_id) FILTER (
            WHERE a.account_code LIKE 'user_%:%'
              AND ll.direction = 'DEBIT'::public.ledger_direction_enum
              AND a.owner_id IS NOT NULL
        )
    )[1] AS payer_user_id,
    (
        ARRAY_AGG(a.owner_id ORDER BY a.owner_id) FILTER (
            WHERE a.account_code LIKE 'user_%:%'
              AND ll.direction = 'CREDIT'::public.ledger_direction_enum
              AND a.owner_id IS NOT NULL
        )
    )[1] AS payee_user_id,
    COALESCE(SUM(
        CASE
            WHEN a.account_code = 'platform_escrow' THEN
                CASE
                    WHEN ll.direction = 'CREDIT'::public.ledger_direction_enum THEN ll.amount::numeric
                    WHEN ll.direction = 'DEBIT'::public.ledger_direction_enum THEN -ll.amount::numeric
                    ELSE 0
                END
            ELSE 0
        END
    ), 0) AS escrow_delta_iqd,
    COALESCE(SUM(
        CASE
            WHEN a.account_code LIKE 'user_available:%' THEN
                CASE
                    WHEN ll.direction = 'CREDIT'::public.ledger_direction_enum THEN ll.amount::numeric
                    WHEN ll.direction = 'DEBIT'::public.ledger_direction_enum THEN -ll.amount::numeric
                    ELSE 0
                END
            ELSE 0
        END
    ), 0) AS user_available_delta_iqd,
    COALESCE(SUM(
        CASE
            WHEN a.account_code LIKE 'user_available:%'
             AND je.event_type IN ('release_with_fee', 'withdrawal_request', 'withdrawal_failed') THEN
                CASE
                    WHEN ll.direction = 'CREDIT'::public.ledger_direction_enum THEN ll.amount::numeric
                    WHEN ll.direction = 'DEBIT'::public.ledger_direction_enum THEN -ll.amount::numeric
                    ELSE 0
                END
            ELSE 0
        END
    ), 0) AS freelancer_payables_available_delta_iqd,
    COALESCE(SUM(
        CASE
            WHEN a.account_code LIKE 'user_pending_withdrawal:%'
             AND je.event_type IN ('withdrawal_request', 'withdrawal_complete', 'withdrawal_failed') THEN
                CASE
                    WHEN ll.direction = 'CREDIT'::public.ledger_direction_enum THEN ll.amount::numeric
                    WHEN ll.direction = 'DEBIT'::public.ledger_direction_enum THEN -ll.amount::numeric
                    ELSE 0
                END
            ELSE 0
        END
    ), 0) AS pending_payouts_delta_iqd,
    COALESCE(SUM(
        CASE
            WHEN a.account_code = 'platform_revenue' THEN
                CASE
                    WHEN ll.direction = 'CREDIT'::public.ledger_direction_enum THEN ll.amount::numeric
                    WHEN ll.direction = 'DEBIT'::public.ledger_direction_enum THEN -ll.amount::numeric
                    ELSE 0
                END
            ELSE 0
        END
    ), 0) AS platform_revenue_delta_iqd,
    COALESCE(SUM(
        CASE
            WHEN a.account_code = 'platform_cash' THEN
                CASE
                    WHEN ll.direction = 'DEBIT'::public.ledger_direction_enum THEN ll.amount::numeric
                    WHEN ll.direction = 'CREDIT'::public.ledger_direction_enum THEN -ll.amount::numeric
                    ELSE 0
                END
            ELSE 0
        END
    ), 0) AS platform_cash_delta_iqd
FROM public.journal_entries je
LEFT JOIN public.ledger_lines ll
  ON ll.journal_entry_id = je.id
LEFT JOIN public.accounts a
  ON a.id = ll.account_id
GROUP BY
    je.id,
    je.created_at,
    je.event_type,
    je.related_entity_type,
    je.related_entity_id,
    je.idempotency_key,
    je.status,
    je.created_by,
    je.meta;

COMMENT ON VIEW public.vw_admin_journal_ledger IS
'Admin denormalized journal ledger with masked/full meta, entity aliases, actor IDs, and per-journal treasury delta columns.';
