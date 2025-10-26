import React, { createContext, useContext, useState, useEffect } from 'react';
import { analyticsTracker } from '../services/analyticsTracker';

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'confirmed' | 'picking' | 'out-for-delivery' | 'delivered';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  deliveryWindow?: string;
}

interface User {
  email: string;
  name: string;
  phone?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  deletePaymentMethod: (id: string) => void;
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  deliveryLocation: string;
  setDeliveryLocation: (location: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Track user changes
  useEffect(() => {
    analyticsTracker.setUser(user);
  }, [user]);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Home',
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      isDefault: true,
    },
  ]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(addresses[0]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true,
    },
  ]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(
    paymentMethods[0]
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryLocation, setDeliveryLocation] = useState('San Francisco, CA 94102');

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress = {
      ...address,
      id: Date.now().toString(),
    };
    setAddresses(prev => [...prev, newAddress]);
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses(prev =>
      prev.map(addr => (addr.id === id ? { ...addr, ...updates } : addr))
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(null);
    }
  };

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod = {
      ...method,
      id: Date.now().toString(),
    };
    setPaymentMethods(prev => [...prev, newMethod]);
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
    if (selectedPaymentMethod?.id === id) {
      setSelectedPaymentMethod(null);
    }
  };

  const addOrder = (order: Omit<Order, 'id' | 'date'>) => {
    const newOrder = {
      ...order,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        selectedAddress,
        setSelectedAddress,
        paymentMethods,
        addPaymentMethod,
        deletePaymentMethod,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        orders,
        addOrder,
        deliveryLocation,
        setDeliveryLocation,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
