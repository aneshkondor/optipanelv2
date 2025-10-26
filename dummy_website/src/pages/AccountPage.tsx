import React from 'react';
import { User, MapPin, CreditCard, Bell, Shield, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { useUser } from '../contexts/UserContext';

interface AccountPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function AccountPage({ onNavigate }: AccountPageProps) {
  const { user, addresses, paymentMethods, deliveryLocation, setDeliveryLocation } =
    useUser();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mb-6">Account Settings</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2 hidden sm:inline" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="h-4 w-4 mr-2 hidden sm:inline" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="payment">
              <CreditCard className="h-4 w-4 mr-2 hidden sm:inline" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Bell className="h-4 w-4 mr-2 hidden sm:inline" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-6">
            <div className="rounded-xl border p-6 space-y-4">
              <h2 className="text-xl">Personal Information</h2>
              <Separator />
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    defaultValue={user?.name || 'John Doe'}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || 'john@example.com'}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue={user?.phone || '+1 (555) 123-4567'}
                    placeholder="Enter your phone"
                  />
                </div>
              </div>
              <Button>Save Changes</Button>
            </div>

            <div className="rounded-xl border p-6 space-y-4">
              <h2 className="text-xl">Security</h2>
              <Separator />
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Addresses */}
          <TabsContent value="addresses" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl">Saved Addresses</h2>
              <Button>Add Address</Button>
            </div>
            <div className="space-y-3">
              {addresses.map((address) => (
                <div key={address.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 flex items-center gap-2">
                        {address.label}
                        {address.isDefault && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {address.street}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.state} {address.zip}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-600"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-6">
              <h3 className="mb-4">Default Delivery Location</h3>
              <div className="flex gap-2">
                <Input
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="Enter ZIP or City"
                />
                <Button>Update</Button>
              </div>
            </div>
          </TabsContent>

          {/* Payment Methods */}
          <TabsContent value="payment" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl">Payment Methods</h2>
              <Button>Add Card</Button>
            </div>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="mb-1 flex items-center gap-2">
                          {method.brand} •••• {method.last4}
                          {method.isDefault && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-600"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="space-y-4">
            <div className="rounded-xl border p-6 space-y-4">
              <h2 className="text-xl">Notifications</h2>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1">Order Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified about your order status
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1">Promotions & Deals</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive exclusive offers and discounts
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1">Newsletter</h3>
                    <p className="text-sm text-muted-foreground">
                      Weekly updates and recipes
                    </p>
                  </div>
                  <input type="checkbox" className="h-5 w-5" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
