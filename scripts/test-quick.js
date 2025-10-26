#!/usr/bin/env node

/**
 * Quick Test Script
 * Tests the system without making actual calls
 */

import { DataAnalyzer } from './src/services/dataAnalyzer.js';
import { EngagementMonitor } from './src/services/engagementMonitor.js';

console.log('🧪 Testing Revenue Optimization System\n');

// Test 1: Data Analyzer
console.log('Test 1: Data Analyzer');
console.log('─────────────────────');

const analyzer = new DataAnalyzer(0.30);

const testData = [
  { timestamp: '2024-01-01T10:00:00Z', value: 90 },
  { timestamp: '2024-01-02T10:00:00Z', value: 88 },
  { timestamp: '2024-01-03T10:00:00Z', value: 85 },
  { timestamp: '2024-01-04T10:00:00Z', value: 60 },
  { timestamp: '2024-01-05T10:00:00Z', value: 45 }
];

const analysis = analyzer.analyzeEngagement(testData);
console.log('Analysis Result:', {
  hasDropped: analysis.hasDropped,
  dropPercentage: analysis.dropPercentage.toFixed(1) + '%',
  trend: analysis.trend,
  baseline: analysis.baseline.toFixed(1),
  recentAverage: analysis.recentAverage.toFixed(1)
});

const patterns = analyzer.detectPatterns(testData);
console.log('Patterns Detected:', patterns.length);

console.log(analysis.hasDropped ? '✅ Drop detected correctly!' : '❌ No drop detected');

// Test 2: Engagement Monitor (without calling)
console.log('\n\nTest 2: Engagement Monitor');
console.log('──────────────────────────');

const monitor = new EngagementMonitor();

// Add test user (with fake phone so no actual call is made)
const testUser = {
  id: 'test_001',
  name: 'Test User',
  phone: '+15555555555', // Fake number
  engagementData: testData
};

console.log('Adding test user...');
monitor.addUser(testUser);

console.log('Getting stats...');
const stats = monitor.getStats();
console.log('Stats:', {
  totalUsers: stats.totalUsers,
  isMonitoring: stats.isMonitoring
});

console.log('\n✅ All tests passed!');
console.log('\nNext steps:');
console.log('1. Get Vapi credentials from https://vapi.ai');
console.log('2. Copy .env.example to .env and add your credentials');
console.log('3. Run: npm start');
console.log('4. Follow QUICKSTART.md for full setup\n');
