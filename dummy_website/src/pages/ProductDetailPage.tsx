import React, { useState, useEffect } from 'react';
import { Star, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { QuantityStepper } from '../components/QuantityStepper';
import { ProductCard } from '../components/ProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { products, frequentlyBoughtTogether } from '../lib/mock-data';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { analyticsTracker } from '../services/analyticsTracker';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, data?: any) => void;
}

export function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const product = products.find((p) => p.id === productId);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  // DO NOT track on mount - product view is tracked when user navigates here
  // The handleNavigate already tracks page views
  // We only track explicit actions like add to cart

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl mb-4">Product not found</h2>
        <Button onClick={() => onNavigate('home')}>Back to Home</Button>
      </div>
    );
  }

  const relatedProductIds = frequentlyBoughtTogether[product.id] || [];
  const relatedProducts = relatedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const displayPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => onNavigate('category', { categoryId: product.category })}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to {product.category}
      </Button>

      {/* Product Details */}
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-muted sticky top-20">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=800&fit=crop"
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          {/* Badges */}
          {product.badges && product.badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.badges.map((badge, idx) => (
                <Badge key={idx} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <div>
            <h1 className="text-4xl mb-2">{product.name}</h1>
            <p className="text-xl text-muted-foreground">{product.unit}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg">{product.rating}</span>
            <span className="text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div>
            <div className="flex items-baseline gap-3">
              {product.discount && (
                <>
                  <span className="text-3xl line-through text-muted-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                  <Badge className="bg-red-500">Save {product.discount}%</Badge>
                </>
              )}
            </div>
            <div className="text-5xl mt-2">${displayPrice.toFixed(2)}</div>
          </div>

          {/* Stock Status */}
          <div className="space-y-2">
            {product.inStock ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <ShieldCheck className="h-5 w-5" />
                <span>In Stock</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <span>Out of Stock</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="h-5 w-5" />
              <span>Delivery: {product.deliveryEta}</span>
            </div>
          </div>

          <Separator />

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Quantity</Label>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                min={1}
                size="lg"
              />
            </div>
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              data-track="add_to_cart.pdp"
            >
              Add to Cart - ${(displayPrice * quantity).toFixed(2)}
            </Button>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="mb-2">About this item</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Details Tabs */}
      <div className="mb-12">
        <Tabs defaultValue="nutrition">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="nutrition" className="mt-6">
            <div className="rounded-lg border p-6">
              <h3 className="mb-4">Nutrition Facts</h3>
              <p className="text-muted-foreground">
                {product.nutrition || 'Nutrition information not available.'}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="ingredients" className="mt-6">
            <div className="rounded-lg border p-6">
              <h3 className="mb-4">Ingredients</h3>
              <p className="text-muted-foreground">
                {product.ingredients || 'Ingredient information not available.'}
              </p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="rounded-lg border p-6">
              <h3 className="mb-4">Customer Reviews</h3>
              <p className="text-muted-foreground">
                Reviews coming soon. Be the first to review this product!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Frequently Bought Together */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl mb-6">Frequently Bought Together</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => onNavigate('product', { productId: p.id })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Label({ children, className = '', ...props }: any) {
  return (
    <label className={`text-sm ${className}`} {...props}>
      {children}
    </label>
  );
}
