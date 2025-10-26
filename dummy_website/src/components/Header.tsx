import React, { useState } from 'react';
import {
  Search,
  MapPin,
  User,
  Package,
  ShoppingCart,
  Menu,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { categories } from '../lib/mock-data';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onSearch: (query: string, category?: string) => void;
}

export function Header({ onNavigate, onSearch }: HeaderProps) {
  const { cartCount, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { deliveryLocation } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery, searchCategory !== 'all' ? searchCategory : undefined);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-16 items-center gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Navigate through StoreName</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-4">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => onNavigate('home')}
                >
                  Home
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => onNavigate('orders')}
                >
                  Orders
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => onNavigate('account')}
                >
                  Account
                </Button>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform"
          >
            StoreName
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl items-center gap-2">
            <Select value={searchCategory} onValueChange={setSearchCategory}>
              <SelectTrigger className="w-[140px]" data-track="search.category">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                data-track="search.input"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0"
                data-track="search.submit"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="flex items-center gap-2">
            {/* Location */}
            <Button
              variant="ghost"
              className="hidden lg:flex items-center gap-2"
              onClick={() => onNavigate('account')}
            >
              <MapPin className="h-5 w-5" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Deliver to</div>
                <div className="text-sm">{deliveryLocation.split(',')[0]}</div>
              </div>
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Account */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={() => onNavigate('account')}
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Orders */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={() => onNavigate('orders')}
            >
              <Package className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
              data-track="cart.open"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="pb-4 md:hidden">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-track="search.input.mobile"
              />
            </div>
            <Button type="submit" size="icon" data-track="search.submit.mobile">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </header>
  );
}
