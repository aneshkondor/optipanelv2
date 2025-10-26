import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  size = 'md',
}: QuantityStepperProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const textClasses = {
    sm: 'w-8',
    md: 'w-12',
    lg: 'w-16',
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className={sizeClasses[size]}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        data-track="quantity.decrease"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className={`text-center ${textClasses[size]}`}>{value}</span>
      <Button
        variant="outline"
        size="icon"
        className={sizeClasses[size]}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        data-track="quantity.increase"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
