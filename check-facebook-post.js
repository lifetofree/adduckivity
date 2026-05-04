// Test script to check post status and trigger Facebook post
// Run with: node check-facebook-post.js

const slug = 'asset-05';

// Mock fetch to test the API endpoint
async function checkPost() {
  try {
    const response = await fetch(`https://immersive.adduckivity.com/api/posts?slug=${slug}`);
    const data = await response.json();
    
    console.log('Post status check:');
    console.log('- Slug:', data.slug);
    console.log('- Title:', data.title);
    console.log('- Status:', data.status);
    console.log('- facebookPosted:', data.facebookPosted);
    console.log('- PublishedAt:', data.publishedAt);
    console.log('- Date:', data.date);
    
    if (!data.facebookPosted && data.status === 'published') {
      console.log('\n⚠️  ISSUE FOUND: Post is published but facebookPosted flag is FALSE');
      console.log('This means the Facebook auto-post was triggered but may have failed.');
      return 'needs_fix';
    } else if (data.facebookPosted) {
      console.log('\n✅ Post has been posted to Facebook');
      return 'ok';
    } else {
      console.log('\n📝 Post is not published yet');
      return 'not_published';
    }
  } catch (error) {
    console.error('Error checking post:', error);
    return 'error';
  }
}

checkPost().then(result => {
  console.log('\nResult:', result);
  process.exit(result === 'error' ? 1 : 0);
});
