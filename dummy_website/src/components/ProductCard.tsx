import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../lib/mock-data';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '../contexts/CartContext';
import { QuantityStepper } from './QuantityStepper';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const cartItem = items.find(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, quantity);
    toast.success(`Added ${product.name} to cart`);
    setQuantity(1);
  };

  const displayPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <motion.div
      className="group relative rounded-xl border bg-card p-4 cursor-pointer overflow-hidden"
      onClick={onClick}
      data-track="product.card.click"
      whileHover={{ 
        y: -8, 
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"
        transition={{ duration: 0.3 }}
      />

      {/* Product Image */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
          <ImageWithFallback
            src={`https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=400&fit=crop&q=80`}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </motion.div>
        {product.discount && (
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: -12 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          >
            <Badge className="absolute top-2 left-2 bg-red-500 shadow-lg">
              {product.discount}% OFF
            </Badge>
          </motion.div>
        )}
        {product.lowStock && (
          <Badge variant="outline" className="absolute top-2 right-2 bg-orange-500/90 text-white border-orange-500">
            Low Stock
          </Badge>
        )}
        
        {/* Quick view overlay */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <ShoppingCart className="h-8 w-8 text-white" />
          </motion.div>
        </motion.div>
      </div>

      {/* Badges */}
      {product.badges && product.badges.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {product.badges.map((badge, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {badge}
            </Badge>
          ))}
        </div>
      )}

      {/* Product Info */}
      <div className="mb-2">
        <h3 className="mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.unit}</p>
      </div>

      {/* Rating */}
      <div className="mb-3 flex items-center gap-1 text-sm">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span>{product.rating}</span>
        <span className="text-muted-foreground">({product.reviewCount})</span>
      </div>

      {/* Price & Delivery */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          {product.discount && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
          <span className="text-2xl">${displayPrice.toFixed(2)}</span>
        </div>
        <p className="text-sm text-green-600 dark:text-green-400">
          {product.deliveryEta}
        </p>
      </div>

      {/* Add to Cart */}
      {cartItem ? (
        <div className="flex items-center gap-2">
          <QuantityStepper
            value={cartItem.quantity}
            onChange={(value) => {
              const { updateQuantity } = useCart.getState?.() || {};
              if (updateQuantity) updateQuantity(product.id, value);
            }}
            size="sm"
          />
          <span className="text-sm text-muted-foreground">in cart</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.max(1, quantity - 1));
              }}
            >
              <Plus className="h-4 w-4 rotate-45" />
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.min(99, quantity + 1));
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleAddToCart}
            className="flex-1"
            size="sm"
            data-track="add_to_cart.card"
          >
            Add
          </Button>
        </div>
      )}
    </motion.div>
  );
}
