import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ProductCard } from '../components/ProductCard';
import { products } from '../lib/mock-data';

interface SearchResultsPageProps {
  query: string;
  category?: string;
  onNavigate: (page: string, data?: any) => void;
  onClearSearch: () => void;
}

export function SearchResultsPage({
  query,
  category,
  onNavigate,
  onClearSearch,
}: SearchResultsPageProps) {
  const filteredProducts = products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || product.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-3xl">Search Results</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-muted-foreground">Showing results for:</span>
          <Badge variant="secondary" className="gap-2">
            {query}
            <button
              onClick={onClearSearch}
              className="hover:bg-secondary-foreground/10 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
          {category && (
            <Badge variant="outline" className="gap-2">
              in {category}
              <button
                onClick={() => onNavigate('search', { query, category: undefined })}
                className="hover:bg-secondary-foreground/10 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-2">
          {filteredProducts.length} products found
        </p>
      </div>

      {/* Results */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl mb-2">No results found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find any products matching "{query}"
          </p>
          <div className="space-y-4">
            <p className="text-sm">Try:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Checking your spelling</li>
              <li>• Using more general terms</li>
              <li>• Browsing our categories instead</li>
            </ul>
            <Button onClick={() => onNavigate('home')} className="mt-6">
              Browse Categories
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
  );
}
