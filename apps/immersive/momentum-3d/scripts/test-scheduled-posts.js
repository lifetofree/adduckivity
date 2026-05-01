#!/usr/bin/env node

/**
 * Test script to manually trigger scheduled post maintenance
 * Usage: node scripts/test-scheduled-posts.js
 * 
 * This will help you verify that:
 * 1. Scheduled posts get promoted to published
 * 2. Facebook posting works when posts are promoted
 */

const fs = require('fs');
const path = require('path');

// Read environment from .dev.vars (if exists) or use dev defaults
function loadEnv() {
  const devVarsPath = path.join(__dirname, '../.dev.vars');
  if (fs.existsSync(devVarsPath)) {
    const content = fs.readFileSync(devVarsPath, 'utf-8');
    const env = {};
    content.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    });
    return env;
  }
  return {};
}

async function testMaintenanceEndpoint() {
  const env = loadEnv();
  const siteUrl = env.SITE_URL || 'http://localhost:3000';
  const maintenanceKey = env.MAINTENANCE_KEY || 'dev-key';
  
  console.log('🔧 Testing scheduled post maintenance...');
  console.log(`📡 Site: ${siteUrl}`);
  console.log(`🔑 Using key: ${maintenanceKey.substring(0, 3)}***`);
  
  try {
    const response = await fetch(`${siteUrl}/api/posts/maintenance`, {
      method: 'GET',
      headers: {
        'x-maintenance-key': maintenanceKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Maintenance endpoint response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`\n🎉 Success! ${data.publishedCount || 0} posts are published.`);
    } else {
      console.log(`\n❌ Maintenance failed: ${data.error}`);
    }
    
  } catch (error) {
    console.error('❌ Error calling maintenance endpoint:', error.message);
    console.log('\n💡 Make sure the development server is running:');
    console.log('   npm run dev');
  }
}

async function testScheduledPostsList() {
  const env = loadEnv();
  const siteUrl = env.SITE_URL || 'http://localhost:3000';
  
  console.log('\n🔍 Checking for scheduled posts...');
  
  try {
    const response = await fetch(`${siteUrl}/api/posts`, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const scheduledPosts = data.posts.filter(p => p.status === 'scheduled');
    
    console.log(`📊 Total posts: ${data.posts.length}`);
    console.log(`⏰ Scheduled posts: ${scheduledPosts.length}`);
    
    if (scheduledPosts.length > 0) {
      console.log('\n📋 Scheduled posts:');
      scheduledPosts.forEach(post => {
        const scheduledTime = new Date(post.scheduledAt);
        const now = new Date();
        const isOverdue = scheduledTime <= now;
        
        console.log(`  • ${post.slug}`);
        console.log(`    Scheduled: ${scheduledTime.toISOString()}`);
        console.log(`    Status: ${isOverdue ? '🔴 OVERDUE - should be published!' : '🟡 Future'}`);
      });
    } else {
      console.log('✨ No scheduled posts found');
    }
    
  } catch (error) {
    console.error('❌ Error fetching posts:', error.message);
  }
}

async function main() {
  console.log('🚀 Duck OS Scheduled Post Testing\n');
  
  await testScheduledPostsList();
  console.log('\n' + '='.repeat(50) + '\n');
  await testMaintenanceEndpoint();
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📖 Setup Instructions:');
  console.log('1. Make sure MAINTENANCE_KEY is set in Cloudflare Pages environment variables');
  console.log('2. Deploy the updated _worker.js and wrangler.toml');
  console.log('3. The CRON job will automatically run every hour');
  console.log('4. You can test anytime by visiting /api/posts/maintenance with the proper key\n');
}

main().catch(console.error);
