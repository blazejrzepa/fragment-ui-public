import * as React from "react";
import { Button, Switch, Input } from "@fragment_ui/ui";

export function SettingsScreen() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Preferences</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium">Enable notifications</label>
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              Receive push notifications
            </p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium">Dark mode</label>
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              Use dark theme
            </p>
          </div>
          <Switch />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Profile</h2>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Display Name</label>
          <Input placeholder="Enter your name" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" placeholder="your@email.com" />
        </div>

        <Button>Save Changes</Button>
      </section>
    </div>
  );
}

