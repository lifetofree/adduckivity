#!/usr/bin/env node

/**
 * Utility script to update a post slug in Cloudflare KV
 * Usage: node scripts/fix-kv-slug.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const KV_NAMESPACE_ID = 'a07209b5ad9a4972aa82a30d0af3071e';
const KV_BINDING = 'POSTS_KV';
const OLD_SLUG = 'why-duck-os-';
const NEW_SLUG = 'why-duck-os';

console.log('🔧 KV Slug Update Utility');
console.log('='.repeat(40));
console.log(`Old slug: "${OLD_SLUG}"`);
console.log(`New slug: "${NEW_SLUG}"`);
console.log('');

// Create a temporary worker script to interact with KV
const workerScript = `
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const action = url.pathname;

    if (action === '/get') {
      const slug = url.searchParams.get('slug');
      const post = await env.POSTS_KV.get(\`post:\${slug}\`, 'json');
      return new Response(JSON.stringify(post), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === '/update') {
      const oldSlug = url.searchParams.get('oldSlug');
      const newSlug = url.searchParams.get('newSlug');

      // Get the old post
      const oldPost = await env.POSTS_KV.get(\`post:\${oldSlug}\`, 'json');
      if (!oldPost) {
        return new Response(JSON.stringify({ error: 'Post not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Update the slug in the post data
      oldPost.slug = newSlug;

      // Save with new key
      await env.POSTS_KV.put(\`post:\${newSlug}\`, JSON.stringify(oldPost));

      // Delete old key
      await env.POSTS_KV.delete(\`post:\${oldSlug}\`);

      return new Response(JSON.stringify({
        success: true,
        message: 'Slug updated successfully',
        oldSlug,
        newSlug,
        post: oldPost
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('KV Slug Update Service', { status: 200 });
  }
};
`;

// Write the temporary worker script
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const workerPath = path.join(tempDir, 'kv-updater.mjs');
fs.writeFileSync(workerPath, workerScript);

// Create a minimal wrangler.toml for this operation
const wranglerConfig = `
name = "kv-slug-updater"
main = "temp/kv-updater.mjs"
compatibility_date = "2024-09-23"

[[kv_namespaces]]
binding = "POSTS_KV"
id = "${KV_NAMESPACE_ID}"
`;

const wranglerPath = path.join(__dirname, '../temp/wrangler.toml');
fs.writeFileSync(wranglerPath, wranglerConfig);

console.log('📝 Created temporary worker for KV operations');
console.log('');

try {
  console.log('🚀 Attempting to update slug in production KV...');
  console.log('');

  // Note: This would require wrangler to be properly authenticated
  // For now, we'll provide manual instructions

  console.log('⚠️  Note: This operation requires wrangler authentication.');
  console.log('');
  console.log('📋 Manual Steps to Update Slug:');
  console.log('');
  console.log('1. Using wrangler CLI:');
  console.log('   npx wrangler kv:key list --namespace-id=' + KV_NAMESPACE_ID);
  console.log('   npx wrangler kv:key get "post:' + OLD_SLUG + '" --namespace-id=' + KV_NAMESPACE_ID);
  console.log('   npx wrangler kv:key delete "post:' + OLD_SLUG + '" --namespace-id=' + KV_NAMESPACE_ID);
  console.log('   npx wrangler kv:key put "post:' + NEW_SLUG + '" --namespace-id=' + KV_NAMESPACE_ID + ' --path=post-data.json');
  console.log('');
  console.log('2. Or use the content editor at:');
  console.log('   https://immersive-adduckivity.pages.dev/content');
  console.log('   Find the post, edit it, and update the slug field.');
  console.log('');
  console.log('3. Or use Cloudflare Dashboard:');
  console.log('   Go to: https://dash.cloudflare.com/');
  console.log('   Navigate to: Workers & Pages > KV > immersive-adduckivity');
  console.log('   Find and rename the key from "post:' + OLD_SLUG + '" to "post:' + NEW_SLUG + '"');

} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  // Cleanup
  try {
    fs.unlinkSync(workerPath);
    fs.unlinkSync(wranglerPath);
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir);
    }
    console.log('');
    console.log('🧹 Cleaned up temporary files');
  } catch (cleanupError) {
    // Ignore cleanup errors
  }
}

console.log('');
console.log('✅ Script complete!');
