import React from 'react';
import { CheckCircle2, Package, MapPin, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useUser } from '../contexts/UserContext';

interface OrderConfirmationPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function OrderConfirmationPage({ onNavigate }: OrderConfirmationPageProps) {
  const { orders } = useUser();
  const latestOrder = orders[0];

  if (!latestOrder) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl mb-4">No recent orders</h2>
        <Button onClick={() => onNavigate('home')}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Message */}
        <div>
          <h1 className="text-4xl mb-3">Order Confirmed!</h1>
          <p className="text-xl text-muted-foreground">
            Thank you for your order. We'll send you a notification when it's on
            the way.
          </p>
        </div>

        {/* Order Details */}
        <div className="rounded-xl border p-6 text-left space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl">Order Details</h3>
            <span className="text-sm text-muted-foreground">
              Order #{latestOrder.id}
            </span>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium mb-1">Items</div>
                <div className="text-sm text-muted-foreground">
                  {latestOrder.items.length} items for ${latestOrder.total.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium mb-1">Delivery Window</div>
                <div className="text-sm text-muted-foreground">
                  {latestOrder.deliveryWindow || 'Today 2:00 PM - 4:00 PM'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium mb-1">Delivery Address</div>
                <div className="text-sm text-muted-foreground">
                  123 Main Street, San Francisco, CA 94102
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="flex-1"
            onClick={() => onNavigate('tracking', { orderId: latestOrder.id })}
            data-track="order_confirmation.track"
          >
            Track Order
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={() => onNavigate('home')}
          >
            Continue Shopping
          </Button>
        </div>

        {/* Support */}
        <p className="text-sm text-muted-foreground">
          Need help?{' '}
          <a href="#" className="text-primary hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
