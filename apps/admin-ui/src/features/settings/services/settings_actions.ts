'use server';

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminRole, logAuditEvent, enforceRateLimit } from "@/features/core/security/security_guards";
import { ServiceResult, ok, fail, toErrorMessage } from "@/features/core/models/result";
import { revalidatePath } from "next/cache";
import { SystemConfig } from "../models/settings.schema";

const CONFIG_MANAGE_ROLES = ['super_admin'];

export async function getSystemConfigs(): Promise<ServiceResult<SystemConfig[]>> {
    try {
        await requireAdminRole(['super_admin', 'support', 'moderator']);
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from('system_config')
            .select('*');

        if (error) return fail('Failed to fetch system configurations');
        return ok(data as SystemConfig[]);
    } catch (error) {
        return fail(toErrorMessage(error));
    }
}

export async function updateSystemConfig(key: string, value: any): Promise<ServiceResult<{key: string}>> {
    try {
        const { userId } = await requireAdminRole(CONFIG_MANAGE_ROLES);
        await enforceRateLimit('update_system_config', userId, 5, 60000);
        const supabase = createAdminClient();

        const { error } = await supabase
            .from('system_config')
            .update({ 
                value, 
                updated_at: new Date().toISOString(),
                updated_by: userId
            })
            .eq('key', key);

        if (error) return fail(`Failed to update config: ${key}`);

        await logAuditEvent({
            action: 'admin.system.update_config',
            actor_user_id: userId,
            related_entity_type: 'system_config',
            related_entity_id: key, // Using key as ID here for logs
            meta: { key, value }
        });

        revalidatePath('/dashboard/settings');
        return ok({ key });
    } catch (error) {
        return fail(toErrorMessage(error));
    }
}
