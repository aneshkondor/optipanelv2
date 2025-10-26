import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { QuantityStepper } from './QuantityStepper';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface CartDrawerProps {
  onCheckout: () => void;
}

export function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const [promoCode, setPromoCode] = useState('');

  const deliveryFee = cartTotal > 35 ? 0 : 4.99;
  const serviceFee = 2.99;
  const total = cartTotal + deliveryFee + serviceFee;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'FRESH20' || promoCode.toUpperCase() === 'FREEDEL') {
      toast.success('Promo code applied!');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    onCheckout();
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Cart ({items.length} items)
          </SheetTitle>
          <SheetDescription>
            Review your items and proceed to checkout
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <motion.div
            className="flex-1 flex flex-col items-center justify-center gap-4 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            </motion.div>
            <div>
              <h3 className="mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">
                Add items to get started
              </p>
            </div>
            <Button onClick={() => setIsCartOpen(false)}>Continue Shopping</Button>
          </motion.div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-auto py-4">
              <div className="space-y-4">
                {items.map((item, idx) => {
                  const itemPrice = item.discount
                    ? item.price * (1 - item.discount / 100)
                    : item.price;

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 rounded-lg border"
                      data-track="cart.item"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop"
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="mb-1 line-clamp-2">{item.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.unit}
                        </p>
                        <div className="flex items-center justify-between">
                          <QuantityStepper
                            value={item.quantity}
                            onChange={(value) => updateQuantity(item.id, value)}
                            size="sm"
                          />
                          <div className="text-right">
                            <div className="font-semibold">
                              ${(itemPrice * item.quantity).toFixed(2)}
                            </div>
                            {item.discount && (
                              <div className="text-xs text-muted-foreground line-through">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={() => removeItem(item.id)}
                        data-track="cart.remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Promo Code */}
            <div className="py-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  data-track="promo.input"
                />
                <Button
                  variant="outline"
                  onClick={handleApplyPromo}
                  data-track="promo.apply"
                >
                  Apply
                </Button>
              </div>
            </div>

            <Separator />

            {/* Summary */}
            <div className="py-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between pt-2">
                <span>Total</span>
                <span className="text-2xl">${total.toFixed(2)}</span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add ${(35 - cartTotal).toFixed(2)} more for free delivery
                </p>
              )}
            </div>

            {/* Checkout Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleCheckout}
              data-track="checkout.start"
            >
              Proceed to Checkout
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
