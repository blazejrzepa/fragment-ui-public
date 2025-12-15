"use client";

import * as React from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  FormField,
  Switch,
  Separator,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@fragment_ui/ui";
import { Save, Bell, Shield, CreditCard, Users } from "lucide-react";

type Notifications = {
  email: boolean;
  push: boolean;
  sms: boolean;
};

type Security = {
  twoFactor: boolean;
  loginAlerts: boolean;
};

export default function SettingsPage() {
  const [notifications, setNotifications] = React.useState<Notifications>({
    email: true,
    push: false,
    sms: false,
  });

  const [security, setSecurity] = React.useState<Security>({
    twoFactor: false,
    loginAlerts: true,
  });

  return (
    <div className="space-y-6 px-2 sm:px-3">
        <div>
          <h1 className="text-3xl font-medium">Settings</h1>
        <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Name">
                  <Input id="name" defaultValue="Admin User" />
                </FormField>
                <FormField label="Email">
                  <Input id="email" type="email" defaultValue="admin@example.com" />
                </FormField>
                <FormField label="Company">
                  <Input id="company" defaultValue="Acme Inc." />
                </FormField>
              <Button leadingIcon={<Save className="h-4 w-4" />}>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[color:var(--color-fg-base)]">Language</p>
                  <p className="text-sm text-[color:var(--color-fg-muted)]">Choose your preferred language</p>
                  </div>
                <Select defaultValue="english">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[color:var(--color-fg-base)]">Timezone</p>
                  <p className="text-sm text-[color:var(--color-fg-muted)]">Set your timezone</p>
                  </div>
                <Select defaultValue="utc">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                    <SelectItem value="cet">CET</SelectItem>
                  </SelectContent>
                </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                <Bell className="mr-2 inline h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[color:var(--color-fg-base)]">Email Notifications</p>
                  <p className="text-sm text-[color:var(--color-fg-muted)]">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[color:var(--color-fg-base)]">Push Notifications</p>
                  <p className="text-sm text-[color:var(--color-fg-muted)]">Receive push notifications</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[color:var(--color-fg-base)]">SMS Notifications</p>
                  <p className="text-sm text-[color:var(--color-fg-muted)]">Receive updates via SMS</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                <Shield className="mr-2 inline h-5 w-5" />
                Security
                </CardTitle>
              <CardDescription>Manage your security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-[color:var(--color-fg-muted)]">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={security.twoFactor}
                  onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Login Alerts</p>
                  <p className="text-xs text-[color:var(--color-fg-muted)]">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                  onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                  />
                </div>
                <Separator />
                <FormField label="Change Password">
                  <Input id="password" type="password" placeholder="Enter new password" />
                <Button variant="outline" size="sm" className="mt-2">
                  Update Password
                </Button>
                </FormField>
              </CardContent>
            </Card>
          </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                <CreditCard className="mr-2 inline h-5 w-5" />
                Billing
                </CardTitle>
              <CardDescription>Manage your billing and invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              <p className="text-sm text-[color:var(--color-fg-muted)]">Billing details and invoices will appear here.</p>
              <Button leadingIcon={<CreditCard className="h-4 w-4" />}>Add Payment Method</Button>
              </CardContent>
            </Card>
          </TabsContent>

        <TabsContent value="team" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                <Users className="mr-2 inline h-5 w-5" />
                Team
                </CardTitle>
              <CardDescription>Manage your team members and roles</CardDescription>
              </CardHeader>
              <CardContent>
              <p className="text-[color:var(--color-fg-muted)]">Team management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}
