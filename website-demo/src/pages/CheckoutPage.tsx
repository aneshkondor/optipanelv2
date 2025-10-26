import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  MapPin,
  Clock,
  FileText,
  CheckCircle2,
  ChevronLeft,
  Gift,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';
import { Slider } from '../components/ui/slider';
import { useCart } from '../contexts/CartContext';
import { useUser } from '../contexts/UserContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CreditCardForm, CardData } from '../components/CreditCardForm';
import { toast } from 'sonner@2.0.3';
import { analyticsTracker } from '../services/analyticsTracker';

interface CheckoutPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, cartTotal, clearCart } = useCart();
  const { selectedAddress, addresses, selectedPaymentMethod, paymentMethods, addOrder } =
    useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [deliverySlot, setDeliverySlot] = useState('today-2-4');
  const [tipPercentage, setTipPercentage] = useState([15]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [promoApplied, setPromoApplied] = useState(false);

  // DO NOT track on mount - navigation already tracked the page view
  // We track checkout completion when user actually places order

  const deliveryFee = cartTotal > 35 ? 0 : 4.99;
  const serviceFee = 2.99;
  const tax = cartTotal * 0.08;
  const tip = (cartTotal * tipPercentage[0]) / 100;
  
  // Apply 100% discount to make total $0 (demo mode)
  const subtotalBeforeDiscount = cartTotal + deliveryFee + serviceFee + tax + tip;
  const discount = promoApplied ? subtotalBeforeDiscount : 0;
  const total = 0; // Always $0 for demo

  const steps = [
    { id: 1, name: 'Address', icon: MapPin },
    { id: 2, name: 'Delivery', icon: Clock },
    { id: 3, name: 'Payment', icon: CreditCard },
    { id: 4, name: 'Review', icon: FileText },
  ];

  const deliverySlots = [
    { id: 'today-2-4', label: 'Today', time: '2:00 PM - 4:00 PM', fee: 0 },
    { id: 'today-4-6', label: 'Today', time: '4:00 PM - 6:00 PM', fee: 0 },
    { id: 'tomorrow-8-10', label: 'Tomorrow', time: '8:00 AM - 10:00 AM', fee: 0 },
    { id: 'tomorrow-10-12', label: 'Tomorrow', time: '10:00 AM - 12:00 PM', fee: 0 },
  ];

  const handleCardSubmit = (data: CardData) => {
    setCardData(data);
    // Auto-apply demo promo
    if (!promoApplied) {
      setPromoApplied(true);
      toast.success('🎉 Demo discount applied! Total is now $0.00');
    }
    setCurrentStep(4);
  };

  const handlePlaceOrder = () => {
    if (!agreedToTerms) {
      toast.error('Please agree to terms and conditions');
      return;
    }

    const selectedSlot = deliverySlots.find((s) => s.id === deliverySlot);
    const orderId = `ORD-${Date.now()}`;

    addOrder({
      total,
      status: 'confirmed',
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      deliveryWindow: selectedSlot ? `${selectedSlot.label} ${selectedSlot.time}` : '',
    });

    // Track order completion
    analyticsTracker.trackOrderCompleted(orderId, total);

    clearCart();
    onNavigate('confirmation');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => onNavigate('home')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Shopping
        </Button>
      </motion.div>

      {/* Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <motion.div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    currentStep >= step.id
                      ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/50'
                      : 'border-muted-foreground text-muted-foreground'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentStep > step.id ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle2 className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <step.icon className="h-6 w-6" />
                  )}
                </motion.div>
                <span className="mt-2 text-sm hidden sm:block">{step.name}</span>
              </motion.div>
              {idx < steps.length - 1 && (
                <motion.div
                  className={`flex-1 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* Main Content */}
        <div>
          {/* Step 1: Address */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl">Delivery Address</h2>
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="p-4 rounded-lg border cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="mb-1">{address.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          {address.street}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.state} {address.zip}
                        </p>
                      </div>
                      {address.isDefault && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setCurrentStep(2)}
                className="w-full"
                data-track="checkout.step_address.next"
              >
                Continue to Delivery
              </Button>
            </div>
          )}

          {/* Step 2: Delivery Slot */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl">Choose Delivery Time</h2>
              <RadioGroup value={deliverySlot} onValueChange={setDeliverySlot}>
                <div className="space-y-3">
                  {deliverySlots.map((slot) => (
                    <label
                      key={slot.id}
                      className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={slot.id} id={slot.id} />
                        <div>
                          <div>{slot.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {slot.time}
                          </div>
                        </div>
                      </div>
                      <div>
                        {slot.fee === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          <span>${slot.fee.toFixed(2)}</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  className="flex-1"
                  data-track="checkout.step_delivery.next"
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-2xl">Payment Information</h2>
              <CreditCardForm
                onSubmit={handleCardSubmit}
                onBack={() => setCurrentStep(2)}
              />
            </motion.div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl">Review Your Order</h2>

              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded bg-muted overflow-hidden">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=100&h=100&fit=crop"
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4>{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Tip */}
              <div>
                <Label className="mb-3 block">Add a tip for your driver</Label>
                <Slider
                  value={tipPercentage}
                  onValueChange={setTipPercentage}
                  max={25}
                  step={5}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0%</span>
                  <span className="font-medium text-foreground">
                    {tipPercentage[0]}% (${tip.toFixed(2)})
                  </span>
                  <span>25%</span>
                </div>
              </div>

              <Separator />

              {/* Terms */}
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions and privacy policy
                </Label>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  className="flex-1"
                  disabled={!agreedToTerms}
                  data-track="checkout.place_order"
                >
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <motion.div
          className="lg:sticky lg:top-20 h-fit"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="rounded-xl border p-6 space-y-4 glass-effect">
            <h3 className="text-xl">Order Summary</h3>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {tipPercentage[0] > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tip</span>
                  <span>${tip.toFixed(2)}</span>
                </div>
              )}
              {promoApplied && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex justify-between text-green-600"
                >
                  <span className="flex items-center gap-1">
                    <Gift className="h-4 w-4" />
                    Demo Discount
                  </span>
                  <span>-${subtotalBeforeDiscount.toFixed(2)}</span>
                </motion.div>
              )}
            </div>
            <Separator />
            <motion.div
              className="flex justify-between text-xl"
              animate={promoApplied ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <span>Total</span>
              <span className={promoApplied ? 'text-green-600' : ''}>
                ${total.toFixed(2)}
              </span>
            </motion.div>
            {promoApplied && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-center text-muted-foreground bg-green-500/10 p-2 rounded"
              >
                🎉 Demo mode: No charges will be made!
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
