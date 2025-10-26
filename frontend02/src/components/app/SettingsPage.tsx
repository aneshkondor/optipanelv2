import { Users, Shield, Key, Bell, CreditCard, Activity } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your workspace settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Workspace Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input id="workspace-name" defaultValue="Acme Corp Analytics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace-url">Workspace URL</Label>
                <div className="flex gap-2">
                  <Input id="workspace-url" defaultValue="acme-corp" className="flex-1" />
                  <span className="flex items-center text-sm text-muted-foreground">
                    .productname.com
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select id="timezone" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>America/Los_Angeles</option>
                  <option>Europe/London</option>
                </select>
              </div>
            </div>
            <Separator className="my-6" />
            <Button>Save Changes</Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive email alerts for important events
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Slack Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Send alerts to Slack channels
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Weekly Digest</div>
                  <div className="text-sm text-muted-foreground">
                    Receive weekly summary reports
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Team Members</h3>
              <Button size="sm">Invite Member</Button>
            </div>
            <div className="space-y-3">
              {['John Doe (You)', 'Jane Smith', 'Mike Johnson'].map((member) => (
                <div key={member} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <div>
                      <div className="font-medium text-sm">{member}</div>
                      <div className="text-xs text-muted-foreground">Admin</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Manage</Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Authentication</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <div className="font-medium">Single Sign-On (SSO)</div>
                  <div className="text-sm text-muted-foreground">
                    SAML 2.0 authentication
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">
                    Require 2FA for all team members
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">API Keys</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <div className="font-medium text-sm">Production API Key</div>
                  <div className="text-xs text-muted-foreground font-mono">pk_prod_••••••••</div>
                </div>
                <Button variant="ghost" size="sm">Rotate</Button>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4">
              Generate New Key
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Current Plan</h3>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg mb-4">
              <div>
                <div className="font-semibold">Growth Plan</div>
                <div className="text-sm text-muted-foreground">$749/month • Billed annually</div>
              </div>
              <Button variant="outline" size="sm">Upgrade</Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Team Members</div>
                <div className="font-medium">12 / 25</div>
              </div>
              <div>
                <div className="text-muted-foreground">Events This Month</div>
                <div className="font-medium">4.2M / 10M</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Payment Method</h3>
            <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium">Visa ending in 4242</div>
                <div className="text-sm text-muted-foreground">Expires 12/2025</div>
              </div>
              <Button variant="ghost" size="sm">Update</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Connected Integrations</h3>
            <div className="space-y-3">
              {[
                { name: 'Slack', status: 'Connected', icon: <Bell className="h-5 w-5" /> },
                { name: 'Stripe', status: 'Connected', icon: <CreditCard className="h-5 w-5" /> },
                { name: 'Snowflake', status: 'Not Connected', icon: <Activity className="h-5 w-5" /> },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      {integration.icon}
                    </div>
                    <div>
                      <div className="font-medium">{integration.name}</div>
                      <div className="text-sm text-muted-foreground">{integration.status}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {integration.status === 'Connected' ? 'Manage' : 'Connect'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
