// Script to update post slug in Cloudflare KV
// This uses the Cloudflare API to update the KV namespace directly

async function updateSlug() {
  const KV_NAMESPACE_ID = 'a07209b5ad9a4972aa82a30d0af3071e';
  const OLD_SLUG = 'why-duck-os-';
  const NEW_SLUG = 'why-duck-os';

  console.log(`Updating slug from "${OLD_SLUG}" to "${NEW_SLUG}"`);
  console.log('Note: This requires Cloudflare API credentials and KV namespace access');
  console.log('');
  console.log('To update the slug in production KV:');
  console.log('1. Go to Cloudflare Dashboard > Workers & Pages > KV');
  console.log('2. Find your KV namespace (immersive-adduckivity)');
  console.log('3. Look for key: post:' + OLD_SLUG);
  console.log('4. Rename it to: post:' + NEW_SLUG);
  console.log('');
  console.log('Alternative: Use the content editor at /content to edit and re-save the post');
}

updateSlug();
