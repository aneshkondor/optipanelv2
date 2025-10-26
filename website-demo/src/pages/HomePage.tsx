import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Tag, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { categories, products, promoDeals } from '../lib/mock-data';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const popularProducts = products.slice(0, 8);
  const dealProducts = products.filter(p => p.discount).slice(0, 4);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner */}
      <section className="relative h-[500px] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&h=500&fit=crop"
            alt="Fresh produce"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-purple-500/20 animate-gradient"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-2xl space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white border border-white/20"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Save 20% on first order</span>
              </motion.div>
              
              <motion.h1
                className="text-5xl md:text-7xl text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Fresh Groceries
                <br />
                <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  Delivered Fast
                </span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl text-white/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Quality products at your doorstep in 2 hours
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <Button
                  size="lg"
                  onClick={() => onNavigate('category', { categoryId: 'fresh-produce' })}
                  data-track="hero.cta"
                  className="text-lg h-14 px-8 shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all"
                >
                  Start Shopping
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </section>

      {/* Promo Deals */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {promoDeals.map((deal, idx) => (
            <motion.div
              key={deal.id}
              className="relative h-56 rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => onNavigate('category')}
              initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=200&fit=crop"
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-purple-600/70 flex items-center p-8">
                <div className="text-white relative z-10">
                  <motion.h3
                    className="text-2xl md:text-3xl mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                  >
                    {deal.title}
                  </motion.h3>
                  <motion.p
                    className="mb-4 text-white/90"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    {deal.description}
                  </motion.p>
                  <motion.div
                    className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm backdrop-blur border border-white/30"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1, type: 'spring' }}
                  >
                    <Tag className="h-4 w-4" />
                    <span className="font-mono">{deal.code}</span>
                  </motion.div>
                </div>
              </div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl md:text-4xl">Shop by Category</h2>
          <Button variant="ghost" className="hidden md:flex">
            View All
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, idx) => (
            <motion.button
              key={category.id}
              onClick={() => onNavigate('category', { categoryId: category.id })}
              className="group relative h-44 rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary/50"
              data-track="category.click"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.05 }}
              whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.4 }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=200&fit=crop"
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
                <div className="text-white text-left w-full relative z-10">
                  <motion.h3
                    className="mb-1 text-lg"
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {category.name}
                  </motion.h3>
                  <p className="text-sm text-white/80">{category.count} items</p>
                </div>
              </div>
              
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-purple-500/0 opacity-0 group-hover:opacity-20"
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="container mx-auto px-4">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl">Popular Near You</h2>
          <Button
            variant="ghost"
            onClick={() => onNavigate('category')}
            data-track="popular.view_all"
          >
            View All
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + idx * 0.05 }}
            >
              <ProductCard
                product={product}
                onClick={() => onNavigate('product', { productId: product.id })}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Deals */}
      {dealProducts.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl">Today's Deals</h2>
            <Button
              variant="ghost"
              onClick={() => onNavigate('category')}
              data-track="deals.view_all"
            >
              View All Deals
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onNavigate('product', { productId: product.id })}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
