// Test script to manually trigger Facebook post by making a PUT request
// This simulates what happens when you edit and save a post in the CMS

async function triggerFacebookViaPut() {
  const slug = 'asset-05';
  
  // First, get the current post data
  console.log('Step 1: Getting current post data...');
  const getResponse = await fetch(`https://immersive.adduckivity.com/api/posts?slug=${slug}`);
  const currentPost = await getResponse.json();
  
  console.log('Current post status:', {
    status: currentPost.status,
    facebookPosted: currentPost.facebookPosted,
    title: currentPost.title
  });
  
  if (currentPost.facebookPosted) {
    console.log('✅ Post already has facebookPosted flag set. No action needed.');
    return;
  }
  
  // Make a PUT request with a tiny change to trigger the Facebook post logic
  // We'll add a temporary tag and then the Facebook logic should kick in
  console.log('\nStep 2: Triggering Facebook post via PUT endpoint...');
  
  const putData = {
    ...currentPost,
    // Keep everything the same but ensure status is published
    status: 'published',
    // The PUT endpoint checks: body.status === 'published' && !existing?.facebookPosted
  };
  
  const putResponse = await fetch(`https://immersive.adduckivity.com/api/posts?slug=${slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(putData)
  });
  
  const result = await putResponse.json();
  console.log('\nPUT Response:', {
    status: putResponse.status,
    facebookPosted: result.facebookPosted,
    facebook: result.facebook
  });
  
  if (result.facebook) {
    if (result.facebook.ok) {
      console.log('✅ SUCCESS! Facebook post was triggered successfully');
      console.log('Post should now be visible on Facebook');
    } else {
      console.log('❌ Facebook post failed:', result.facebook.error);
    }
  } else {
    console.log('ℹ️  Facebook post was not triggered (might be already posted)');
  }
  
  // Verify final state
  console.log('\nStep 3: Verifying final state...');
  const finalResponse = await fetch(`https://immersive.adduckivity.com/api/posts?slug=${slug}`);
  const finalPost = await finalResponse.json();
  
  console.log('Final state:', {
    status: finalPost.status,
    facebookPosted: finalPost.facebookPosted
  });
}

triggerFacebookViaPut().catch(console.error);
