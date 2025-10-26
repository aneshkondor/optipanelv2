import React from 'react';
import {
  Package,
  ShoppingBag,
  Truck,
  CheckCircle2,
  MapPin,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useUser } from '../contexts/UserContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface OrderTrackingPageProps {
  orderId?: string;
  onNavigate: (page: string, data?: any) => void;
}

export function OrderTrackingPage({ orderId, onNavigate }: OrderTrackingPageProps) {
  const { orders } = useUser();
  const order = orderId ? orders.find((o) => o.id === orderId) : orders[0];

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl mb-4">Order not found</h2>
        <Button onClick={() => onNavigate('orders')}>View All Orders</Button>
      </div>
    );
  }

  const statusSteps = [
    {
      id: 'confirmed',
      name: 'Order Confirmed',
      icon: Package,
      description: 'We received your order',
    },
    {
      id: 'picking',
      name: 'Picking Items',
      icon: ShoppingBag,
      description: 'Your items are being picked',
    },
    {
      id: 'out-for-delivery',
      name: 'Out for Delivery',
      icon: Truck,
      description: 'Your order is on the way',
    },
    {
      id: 'delivered',
      name: 'Delivered',
      icon: CheckCircle2,
      description: 'Order delivered successfully',
    },
  ];

  const currentStepIndex = statusSteps.findIndex((step) => step.id === order.status);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2">Track Your Order</h1>
          <p className="text-muted-foreground">Order #{order.id}</p>
        </div>

        {/* Status Timeline */}
        <div className="rounded-xl border p-6">
          <h2 className="text-xl mb-6">Order Status</h2>
          <div className="space-y-6">
            {statusSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                        isCompleted
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-muted text-muted-foreground'
                      }`}
                    >
                      <step.icon className="h-6 w-6" />
                    </div>
                    {idx < statusSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-12 my-1 ${
                          isCompleted ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3
                      className={`mb-1 ${
                        isCurrent ? 'text-primary' : ''
                      }`}
                    >
                      {step.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-primary mt-1 font-medium">
                        In Progress
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="rounded-xl border overflow-hidden">
          <div className="aspect-video bg-muted flex items-center justify-center relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=400&fit=crop"
              alt="Delivery map"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-primary" />
                <p className="text-muted-foreground">Live tracking coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border p-6">
            <h3 className="mb-4">Delivery Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Delivery Window</div>
                <div>{order.deliveryWindow || 'Today 2:00 PM - 4:00 PM'}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Address</div>
                <div>123 Main Street</div>
                <div>San Francisco, CA 94102</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-6">
            <h3 className="mb-4">Order Items</h3>
            <div className="space-y-2">
              {order.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="text-sm text-muted-foreground">
                  +{order.items.length - 3} more items
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="rounded-xl border p-6">
          <h3 className="mb-4">Need Help?</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call Support
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat with Us
            </Button>
          </div>
        </div>

        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => onNavigate('orders')}
          className="w-full"
        >
          View All Orders
        </Button>
      </div>
    </div>
  );
}
