import React from 'react';
import { Package, Clock, CheckCircle2, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useUser } from '../contexts/UserContext';

interface OrdersPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function OrdersPage({ onNavigate }: OrdersPageProps) {
  const { orders } = useUser();

  const statusConfig = {
    confirmed: {
      label: 'Confirmed',
      icon: Package,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    },
    picking: {
      label: 'Picking',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    },
    'out-for-delivery': {
      label: 'Out for Delivery',
      icon: Truck,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    },
    delivered: {
      label: 'Delivered',
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    },
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl mb-6">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12 rounded-xl border">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here
            </p>
            <Button onClick={() => onNavigate('home')}>Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <div
                  key={order.id}
                  className="rounded-xl border p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onNavigate('tracking', { orderId: order.id })}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3>Order #{order.id}</h3>
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-2xl">${order.total.toFixed(2)}</div>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} items
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Items Preview */}
                  <div className="space-y-2 mb-4">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} x{item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-muted-foreground">
                        +{order.items.length - 3} more items
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('tracking', { orderId: order.id });
                      }}
                    >
                      Track Order
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Reorder functionality
                      }}
                    >
                      Reorder
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        // View receipt
                      }}
                    >
                      View Receipt
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
