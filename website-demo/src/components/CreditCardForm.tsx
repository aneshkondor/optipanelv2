import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Lock, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from './ui/utils';

interface CreditCardFormProps {
  onSubmit: (cardData: CardData) => void;
  onBack: () => void;
}

export interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

export function CreditCardForm({ onSubmit, onBack }: CreditCardFormProps) {
  const [cardData, setCardData] = useState<CardData>({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [isFlipped, setIsFlipped] = useState(false);
  const [errors, setErrors] = useState<Partial<CardData>>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + ' / ' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardData({ ...cardData, number: formatted });
      if (errors.number) setErrors({ ...errors, number: undefined });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.replace(/\s|\//g, '').length <= 4) {
      setCardData({ ...cardData, expiry: formatted });
      if (errors.expiry) setErrors({ ...errors, expiry: undefined });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setCardData({ ...cardData, cvv: value });
      if (errors.cvv) setErrors({ ...errors, cvv: undefined });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, name: e.target.value });
    if (errors.name) setErrors({ ...errors, name: undefined });
  };

  const validateCard = () => {
    const newErrors: Partial<CardData> = {};
    
    if (cardData.number.replace(/\s/g, '').length !== 16) {
      newErrors.number = 'Invalid card number';
    }
    if (!cardData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (cardData.expiry.replace(/\s|\//g, '').length !== 4) {
      newErrors.expiry = 'Invalid expiry date';
    }
    if (cardData.cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCard()) {
      onSubmit(cardData);
    }
  };

  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5')) return 'Mastercard';
    if (num.startsWith('3')) return 'Amex';
    return 'Card';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Card Preview */}
      <div className="perspective-1000">
        <motion.div
          className="relative w-full h-52"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of Card */}
          <motion.div
            className="absolute inset-0 rounded-2xl p-6 shadow-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <div className="relative h-full flex flex-col justify-between text-white">
              <div className="flex justify-between items-start">
                <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded opacity-80" />
                <div className="text-sm opacity-80">{getCardType(cardData.number)}</div>
              </div>
              
              <div className="space-y-4">
                <div className="text-2xl tracking-wider font-mono">
                  {cardData.number || '•••• •••• •••• ••••'}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-70 mb-1">Card Holder</div>
                    <div className="uppercase tracking-wide">
                      {cardData.name || 'YOUR NAME'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-70 mb-1">Expires</div>
                    <div className="tracking-wide">
                      {cardData.expiry || 'MM / YY'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />
            </div>
          </motion.div>

          {/* Back of Card */}
          <motion.div
            className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              rotateY: 180,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <div className="h-full">
              <div className="h-12 bg-black mt-6" />
              <div className="p-6">
                <div className="bg-white h-10 rounded flex items-center justify-end px-3">
                  <span className="text-black font-mono">{cardData.cvv || '•••'}</span>
                </div>
                <div className="text-white text-xs mt-3 opacity-70">
                  Security code (CVV)
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Card Number
            </Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardData.number}
              onChange={handleCardNumberChange}
              onFocus={() => setIsFlipped(false)}
              className={cn(
                'mt-2 font-mono text-lg',
                errors.number && 'border-destructive focus-visible:ring-destructive'
              )}
              data-track="payment.card_number"
            />
            {errors.number && (
              <p className="text-sm text-destructive mt-1">{errors.number}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="JOHN DOE"
              value={cardData.name}
              onChange={handleNameChange}
              onFocus={() => setIsFlipped(false)}
              className={cn(
                'mt-2 uppercase',
                errors.name && 'border-destructive focus-visible:ring-destructive'
              )}
              data-track="payment.card_name"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM / YY"
                value={cardData.expiry}
                onChange={handleExpiryChange}
                onFocus={() => setIsFlipped(false)}
                className={cn(
                  'mt-2 font-mono',
                  errors.expiry && 'border-destructive focus-visible:ring-destructive'
                )}
                data-track="payment.expiry"
              />
              {errors.expiry && (
                <p className="text-sm text-destructive mt-1">{errors.expiry}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cvv" className="flex items-center gap-2">
                CVV
                <Info className="h-3 w-3 text-muted-foreground" />
              </Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cardData.cvv}
                onChange={handleCvvChange}
                onFocus={() => setIsFlipped(true)}
                onBlur={() => setIsFlipped(false)}
                type="password"
                maxLength={4}
                className={cn(
                  'mt-2 font-mono',
                  errors.cvv && 'border-destructive focus-visible:ring-destructive'
                )}
                data-track="payment.cvv"
              />
              {errors.cvv && (
                <p className="text-sm text-destructive mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg border">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Your payment information is encrypted and secure. This is a demo - no actual charges will be made.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1"
            data-track="payment.submit"
          >
            Continue to Review
          </Button>
        </div>
      </form>
    </div>
  );
}
