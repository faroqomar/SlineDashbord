import { NextRequest, NextResponse } from 'next/server';
import { getAuditLogs } from '@/features/finance/actions/queries';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const filters = {
      action: searchParams.get('action') || undefined,
      actor_user_id: searchParams.get('actor_user_id') || undefined,
      start_date: searchParams.get('start_date') || undefined,
      end_date: searchParams.get('end_date') || undefined,
      limit: 10000 // Fetch up to 10k for export
    };

    const res = await getAuditLogs(filters);

    if (!res.success) {
      return new Response(res.error, { status: 500 });
    }

    const logs = res.data.data;

    let csvContent = 'ID,Date,Actor,Action,Entity Type,Entity ID,Journal ID,Metadata\n';
    
    for (const log of logs) {
      const line = [
        log.id,
        new Date(log.created_at).toISOString(),
        log.actor_user_id,
        log.action,
        log.related_entity_type || '',
        log.related_entity_id || '',
        log.journal_entry_id || '',
        JSON.stringify(log.meta).replace(/"/g, '""') // Escape quotes for CSV
      ].map(field => `"${field}"`).join(',');
      
      csvContent += line + '\n';
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="sline_audit_export_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
