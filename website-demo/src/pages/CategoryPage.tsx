import React, { useState, useMemo } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { products, categories } from '../lib/mock-data';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../components/ui/collapsible';

interface CategoryPageProps {
  categoryId?: string;
  onNavigate: (page: string, data?: any) => void;
}

export function CategoryPage({ categoryId, onNavigate }: CategoryPageProps) {
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const category = categories.find((c) => c.id === categoryId);
  
  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = categoryId
      ? products.filter((p) => p.category === categoryId)
      : products;

    // Apply filters
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }
    if (minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }
    if (selectedBadges.length > 0) {
      filtered = filtered.filter((p) =>
        p.badges?.some((b) => selectedBadges.includes(b))
      );
    }
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [categoryId, sortBy, priceRange, selectedBadges, inStockOnly, minRating]);

  const allBadges = Array.from(
    new Set(products.flatMap((p) => p.badges || []))
  );

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Availability */}
      <div>
        <h3 className="mb-3">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
            data-track="filter.availability"
          />
          <Label htmlFor="in-stock">In Stock Only</Label>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={50}
            step={1}
            className="w-full"
            data-track="filter.price"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Dietary & Certifications */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3>Dietary & Certifications</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          {allBadges.map((badge) => (
            <div key={badge} className="flex items-center space-x-2">
              <Checkbox
                id={`badge-${badge}`}
                checked={selectedBadges.includes(badge)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedBadges([...selectedBadges, badge]);
                  } else {
                    setSelectedBadges(selectedBadges.filter((b) => b !== badge));
                  }
                }}
                data-track="filter.badge"
              />
              <Label htmlFor={`badge-${badge}`}>{badge}</Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Rating */}
      <div>
        <h3 className="mb-3">Minimum Rating</h3>
        <Select
          value={minRating.toString()}
          onValueChange={(value) => setMinRating(parseFloat(value))}
        >
          <SelectTrigger data-track="filter.rating">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Ratings</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="4.5">4.5+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl mb-2">
          {category ? category.name : 'All Products'}
        </h1>
        <p className="text-muted-foreground">
          {filteredProducts.length} products found
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        {/* Mobile Filter */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden" data-track="filter.open.mobile">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterPanel />
            </div>
          </SheetContent>
        </Sheet>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Sort by:
          </span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]" data-track="sort.change">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <FilterPanel />
          </div>
        </aside>

        {/* Products Grid */}
        <div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => onNavigate('product', { productId: product.id })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
