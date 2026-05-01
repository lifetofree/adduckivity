#!/usr/bin/env node

/**
 * Debug script to check published posts and manually trigger Facebook posting
 * Usage: node scripts/debug-facebook-posting.js <post-slug>
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

async function getPosts() {
  const env = loadEnv();
  const siteUrl = env.SITE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${siteUrl}/api/posts`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.posts;
  } catch (error) {
    console.error('❌ Error fetching posts:', error.message);
    console.log(`   Trying: ${siteUrl}/api/posts`);
    return [];
  }
}

async function manualFacebookPost(slug) {
  const env = loadEnv();
  const siteUrl = env.SITE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${siteUrl}/api/posts`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        status: 'published' // This should trigger Facebook posting
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error posting to Facebook:', error.message);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const targetSlug = args[0];
  
  console.log('🔍 Duck OS Facebook Posting Debug\n');
  
  const env = loadEnv();
  const siteUrl = env.SITE_URL || 'http://localhost:3000';
  console.log(`🌐 Target site: ${siteUrl}\n`);
  
  if (env.SITE_URL) {
    console.log('📡 Using production site from .dev.vars');
  } else {
    console.log('📡 Using development server (http://localhost:3000)');
    console.log('   To use production, set SITE_URL in .dev.vars');
  }
  console.log('');
  
  console.log('📊 Fetching all posts...');
  
  const posts = await getPosts();
  
  if (posts.length === 0) {
    console.log('❌ No posts found. Make sure the dev server is running:');
    console.log('   npm run dev');
    return;
  }
  
  console.log(`✅ Found ${posts.length} posts\n`);
  
  // Find published posts that haven't been posted to Facebook
  const publishedNotPosted = posts.filter(p => 
    p.status === 'published' && !p.facebookPosted
  );
  
  console.log('📝 Published posts NOT on Facebook:');
  if (publishedNotPosted.length === 0) {
    console.log('   ✨ None! All published posts are on Facebook.');
  } else {
    publishedNotPosted.forEach(post => {
      console.log(`   • ${post.slug}`);
      console.log(`     ${post.title}`);
      console.log(`     Published: ${post.date}`);
      console.log(`     Facebook: ${post.facebookPosted ? '✅' : '❌'}`);
      console.log('');
    });
  }
  
  console.log('📱 Published posts already on Facebook:');
  const publishedAndPosted = posts.filter(p => 
    p.status === 'published' && p.facebookPosted
  );
  if (publishedAndPosted.length === 0) {
    console.log('   ✨ None yet.');
  } else {
    publishedAndPosted.forEach(post => {
      console.log(`   • ${post.slug} ✅`);
    });
  }
  
  // If a specific slug was provided, try to post it
  if (targetSlug) {
    console.log(`\n🎯 Attempting to manually post "${targetSlug}" to Facebook...`);
    
    const post = posts.find(p => p.slug === targetSlug);
    if (!post) {
      console.log(`❌ Post "${targetSlug}" not found.`);
      return;
    }
    
    if (post.facebookPosted) {
      console.log('⚠️  This post has already been posted to Facebook.');
      console.log('   To force repost, you would need to reset the facebookPosted flag.');
      return;
    }
    
    const result = await manualFacebookPost(targetSlug);
    if (result && result.facebook) {
      if (result.facebook.ok) {
        console.log('✅ Successfully posted to Facebook!');
        console.log(`   Check your Facebook page for the post.`);
      } else {
        console.log('❌ Facebook posting failed:');
        console.log(`   Error: ${result.facebook.error}`);
      }
    } else if (result) {
      console.log('ℹ️  Post updated but Facebook response missing.');
      console.log('   This might mean Facebook posting was skipped.');
    } else {
      console.log('❌ Failed to update post.');
    }
  } else if (publishedNotPosted.length > 0) {
    console.log(`\n💡 To manually post to Facebook, run:`);
    console.log(`   node scripts/debug-facebook-posting.js ${publishedNotPosted[0].slug}`);
  } else {
    console.log(`\n✨ Everything looks good!`);
  }
}

main().catch(console.error);
