/**
 * Real-time Analytics Tracker
 * Captures all user interactions and sends them to the analytics backend
 */

interface UserMetric {
  userId: string;
  userName: string;
  email: string;
  company?: string;
  timestamp: string;
  sessionDuration: number;
  pageViews: number;
  clickCount: number;
  scrollDepth: number;
  featuresUsed: string[];
  activeFeature: string;
  featureTime: Record<string, number>;
  eventsTriggered: number;
  queriesRun: number;
  reportsCreated: number;
  dashboardsViewed: number;
  isActive: boolean;
  lastAction: string;
  lastActionTime: string;
  cartItems?: number;
  cartValue?: number;
  productsViewed?: string[];
  searchQueries?: string[];
  checkoutStarted?: boolean;
  orderCompleted?: boolean;
}

class AnalyticsTracker {
  private metrics: Partial<UserMetric> = {};
  private sessionStartTime: number = Date.now();
  private lastActivityTime: number = Date.now();
  private featureTimeTracking: Record<string, number> = {};
  private currentFeature: string = 'Home';
  private featureStartTime: number = Date.now();
  private clickCount: number = 0;
  private scrollDepthMax: number = 0;
  private pageViews: number = 0;
  private eventsTriggered: number = 0;
  private productsViewed: Set<string> = new Set();
  private searchQueries: string[] = [];
  private featuresUsed: Set<string> = new Set(['Home']);

  // Send on activity
  private lastSendTime: number = 0;
  private readonly MIN_SEND_INTERVAL_MS = 2000; // Minimum 2 seconds between sends
  private readonly BACKEND_URL = 'http://localhost:3001/api/metrics/track';
  private pendingSend: boolean = false;

  constructor() {
    // Generate a persistent session ID for this user
    this.metrics.userId = this.getOrCreateUserId();
    this.metrics.userName = 'Guest User';
    this.metrics.email = this.metrics.userId + '@guest.com';
    this.metrics.company = 'Demo Customer';

    this.initializeTracking();

    console.log('🚀 Analytics Tracker Initialized');
    console.log('📊 User ID:', this.metrics.userId);
    console.log('⏳ Waiting for user interactions... (NO AUTO-TRACKING)');
    // DO NOT send initial metrics - wait for actual user action
  }

  // Get or create a persistent user ID for this session
  private getOrCreateUserId(): string {
    let userId = sessionStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }

  private initializeTracking() {
    // Track clicks (only increment clickCount, specific actions send metrics)
    document.addEventListener('click', (e) => {
      this.clickCount++;
      this.lastActivityTime = Date.now();
      // DO NOT send metrics here - specific actions will handle it
    });

    // Track scroll depth (NO metrics sending)
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const height = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = Math.round((scrolled / height) * 100);

          if (scrollPercent > this.scrollDepthMax) {
            this.scrollDepthMax = scrollPercent;
          }

          this.lastActivityTime = Date.now();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Track visibility changes (send final state when leaving)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updateFeatureTime();
        // Send final metrics when user leaves tab
        this.sendMetricsNow();
      } else {
        this.lastActivityTime = Date.now();
        this.featureStartTime = Date.now();
      }
    });

    // Track before unload (send final state)
    window.addEventListener('beforeunload', () => {
      this.updateFeatureTime();
      this.sendMetricsNow();
    });
  }

  // Set user info (called from UserContext)
  setUser(user: { email: string; name: string; phone?: string } | null) {
    if (user) {
      this.metrics.userId = user.email;
      this.metrics.userName = user.name;
      this.metrics.email = user.email;
      this.metrics.company = 'Demo Customer';
    }
  }

  // Track page view
  trackPageView(pageName: string) {
    this.updateFeatureTime();

    this.pageViews++;
    this.eventsTriggered++; // COUNT AS 1 EVENT
    this.currentFeature = pageName;
    this.featureStartTime = Date.now();
    this.featuresUsed.add(pageName);
    this.lastActivityTime = Date.now();

    console.log(`[Analytics] Page View: ${pageName}`);
    this.scheduleSend();
  }

  // Track cart actions
  trackCartAction(action: 'add' | 'remove' | 'update', itemCount: number, totalValue: number) {
    this.metrics.cartItems = itemCount;
    this.metrics.cartValue = totalValue;
    this.eventsTriggered++; // COUNT AS 1 EVENT
    this.lastActivityTime = Date.now();

    console.log(`[Analytics] Cart ${action}: ${itemCount} items, $${totalValue}`);
    this.scheduleSend();
  }

  // Track product view
  trackProductView(productId: string, productName: string) {
    this.productsViewed.add(productId);
    this.eventsTriggered++; // COUNT AS 1 EVENT
    this.lastActivityTime = Date.now();

    console.log(`[Analytics] Product View: ${productName}`);
    this.scheduleSend();
  }

  // Track search
  trackSearch(query: string) {
    this.searchQueries.push(query);
    this.eventsTriggered++; // COUNT AS 1 EVENT
    this.lastActivityTime = Date.now();

    console.log(`[Analytics] Search: ${query}`);
    this.scheduleSend();
  }

  // Track checkout
  trackCheckoutStarted() {
    this.metrics.checkoutStarted = true;
    this.eventsTriggered++; // COUNT AS 1 EVENT
    this.lastActivityTime = Date.now();

    console.log('[Analytics] Checkout Started');
    this.scheduleSend();
  }

  // Track order
  trackOrderCompleted(orderId: string, total: number) {
    this.metrics.orderCompleted = true;
    this.eventsTriggered++; // COUNT AS 1 EVENT
    this.lastActivityTime = Date.now();

    console.log(`[Analytics] Order Completed: ${orderId}, $${total}`);
    this.scheduleSend();
  }

  // Update time spent in current feature
  private updateFeatureTime() {
    const timeSpent = Math.floor((Date.now() - this.featureStartTime) / 1000);
    this.featureTimeTracking[this.currentFeature] =
      (this.featureTimeTracking[this.currentFeature] || 0) + timeSpent;
  }

  // Build current metrics snapshot
  private buildMetrics(): UserMetric {
    this.updateFeatureTime();

    const sessionDuration = Math.floor((Date.now() - this.sessionStartTime) / 1000 / 60);
    const isActive = (Date.now() - this.lastActivityTime) < 60000; // Active if action in last 60s

    const metrics = {
      userId: this.metrics.userId!, // Use existing persistent ID
      userName: this.metrics.userName!,
      email: this.metrics.email!,
      company: this.metrics.company!,
      timestamp: new Date().toISOString(),
      sessionDuration,
      pageViews: this.pageViews,
      clickCount: this.clickCount,
      scrollDepth: this.scrollDepthMax,
      featuresUsed: Array.from(this.featuresUsed),
      activeFeature: this.currentFeature,
      featureTime: { ...this.featureTimeTracking },
      eventsTriggered: this.eventsTriggered,
      queriesRun: this.searchQueries.length,
      reportsCreated: 0,
      dashboardsViewed: this.pageViews,
      isActive,
      lastAction: this.currentFeature,
      lastActionTime: new Date(this.lastActivityTime).toISOString(),
      cartItems: this.metrics.cartItems,
      cartValue: this.metrics.cartValue,
      productsViewed: Array.from(this.productsViewed),
      searchQueries: this.searchQueries,
      checkoutStarted: this.metrics.checkoutStarted,
      orderCompleted: this.metrics.orderCompleted,
    };

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 ANALYTICS SNAPSHOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User: ${metrics.userName} (${metrics.userId})
Events: ${metrics.eventsTriggered} 🎯
Page Views: ${metrics.pageViews} 📄
Clicks: ${metrics.clickCount} 🖱️
Session: ${metrics.sessionDuration} min ⏱️
Active: ${metrics.isActive ? '✅ Yes' : '❌ No'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
    return metrics;
  }

  // Schedule a send (throttled to avoid spamming)
  private scheduleSend() {
    const now = Date.now();
    const timeSinceLastSend = now - this.lastSendTime;

    if (timeSinceLastSend >= this.MIN_SEND_INTERVAL_MS) {
      // Send immediately
      this.sendMetrics();
      this.lastSendTime = now;
      this.pendingSend = false;
    } else if (!this.pendingSend) {
      // Schedule send after throttle period
      this.pendingSend = true;
      const delay = this.MIN_SEND_INTERVAL_MS - timeSinceLastSend;
      setTimeout(() => {
        this.sendMetrics();
        this.lastSendTime = Date.now();
        this.pendingSend = false;
      }, delay);
    }
  }

  // Send metrics to backend (through scheduler)
  private async sendMetrics() {
    const metrics = this.buildMetrics();

    try {
      await fetch(this.BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
        keepalive: true,
      });

      console.log('[Analytics] ✅ Metrics sent');
    } catch (error) {
      console.error('[Analytics] ❌ Failed to send:', error);
    }
  }

  // Send metrics immediately (bypass throttling for visibility/unload)
  private async sendMetricsNow() {
    const metrics = this.buildMetrics();

    try {
      await fetch(this.BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
        keepalive: true,
      });

      console.log('[Analytics] ✅ Final metrics sent');
    } catch (error) {
      console.error('[Analytics] ❌ Failed to send final metrics:', error);
    }
  }

  // Stop tracking (cleanup)
  public destroy() {
    this.sendMetrics(); // Final send
  }
}

// Singleton instance
export const analyticsTracker = new AnalyticsTracker();
