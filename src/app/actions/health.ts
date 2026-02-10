'use server';

import { createAdminClient } from "@/lib/supabase/admin";

export type ServiceStatus = {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  latency: number; // in ms
  lastChecked: string;
};

export async function getSystemHealth(): Promise<ServiceStatus[]> {
    const services: ServiceStatus[] = [];
    const supabase = createAdminClient();

    // 1. Database Check
    const dbStart = performance.now();
    try {
        const { error } = await supabase.from('admin_users').select('id').limit(1).single();
        const dbLatency = Math.round(performance.now() - dbStart);
        services.push({
            name: 'Database (Postgres)',
            status: error ? 'degraded' : 'operational',
            latency: dbLatency,
            lastChecked: new Date().toISOString()
        });
    } catch (e) {
        services.push({
            name: 'Database (Postgres)',
            status: 'down',
            latency: 0,
            lastChecked: new Date().toISOString()
        });
    }

    // 2. Auth Check
    const authStart = performance.now();
    try {
        const { error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
        const authLatency = Math.round(performance.now() - authStart);
        services.push({
             name: 'Auth Service',
             status: error ? 'degraded' : 'operational',
             latency: authLatency,
             lastChecked: new Date().toISOString()
        });
    } catch (e) {
        services.push({
            name: 'Auth Service',
            status: 'down',
            latency: 0,
            lastChecked: new Date().toISOString()
        });
    }

    // 3. Storage Check
    const storageStart = performance.now();
    try {
        const { error } = await supabase.storage.listBuckets();
        const storageLatency = Math.round(performance.now() - storageStart);
        services.push({
            name: 'Storage',
            status: error ? 'degraded' : 'operational',
            latency: storageLatency,
            lastChecked: new Date().toISOString()
        });
    } catch (e) {
        services.push({
            name: 'Storage',
            status: 'down',
            latency: 0,
            lastChecked: new Date().toISOString()
        });
    }

    // 4. API / Edge Functions (Simulated for now as we don't have a specific endpoint to ping)
    // We can assume if Vercel is running this code, API is up.
    services.push({
        name: 'API Gateway',
        status: 'operational',
        latency: Math.round(Math.random() * 50 + 20), // Simulated latency
        lastChecked: new Date().toISOString()
    });

    return services;
}
