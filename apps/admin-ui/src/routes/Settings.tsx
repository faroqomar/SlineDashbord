import React from 'react';
import { Settings as SettingsIcon, Shield, Bell, Database, Globe } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold font-inter tracking-tight">System Settings</h2>
        <p className="text-slate-400 mt-1">Configure platform parameters and security policies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-1">
          <SettingsTab icon={<Shield size={18} />} label="Security" active />
          <SettingsTab icon={<Bell size={18} />} label="Notifications" />
          <SettingsTab icon={<Database size={18} />} label="API Keys" />
          <SettingsTab icon={<Globe size={18} />} label="Localization" />
        </aside>

        <div className="md:col-span-3 glass-card space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Security Policies</h3>
            <div className="space-y-6">
              <ToggleItem label="Enforce 2FA for all Admins" description="Require two-factor authentication for all users with support roles and higher." enabled={true} />
              <ToggleItem label="IP Whitelisting" description="Restrict access to the Admin Dashboard to approved IP addresses only." enabled={false} />
              <ToggleItem label="Session Timeout" description="Automatically log users out after 30 minutes of inactivity." enabled={true} />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-semibold shadow-lg shadow-blue-500/20">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${active ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function ToggleItem({ label, description, enabled }: { label: string; description: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h4 className="font-bold text-slate-200">{label}</h4>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${enabled ? 'bg-blue-500' : 'bg-slate-700'}`}>
        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}
