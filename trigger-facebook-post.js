// Manual Facebook post trigger for asset-05
// This script directly calls the Facebook API using environment variables

const fetch = require('node-fetch');

async function postToFacebook() {
  const post = {
    slug: 'asset-05',
    title: 'วิธีเปลี่ยนระบบชีวิตจาก \'ภาระ\' ให้เป็น \'สินทรัพย์\' ด้วยโพรโทคอล ASSET-05',
    excerpt: 'เลิกพึ่งพาวินัยที่แสนเปราะบาง แล้วหันมาสร้าง "Mental Infrastructure" กันดีกว่า เปลี่ยนระบบชีวิตจากหนี้สินที่กินพลังงาน ให้กลายเป็นสินทรัพย์ที่ช่วยรันชีวิตให้คุณโดยไม่ต้องเหนื่อยเท่าเดิม'
  };

  // You need to set these environment variables or replace with actual values
  const pageId = process.env.FACEBOOK_PAGE_ID || 'YOUR_PAGE_ID';
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN';
  const siteUrl = process.env.SITE_URL || 'https://immersive.adduckivity.com';

  const link = `${siteUrl}/blog/${post.slug}`;
  const message = `🦆 ${post.title}\n\n${post.excerpt}\n\nRead the full protocol → ${link}\n\n#DuckOS #Productivity #ADHD #Neurodivergent`;

  const params = new URLSearchParams({ message, link, access_token: token });

  try {
    console.log('Attempting to post to Facebook...');
    console.log('Page ID:', pageId);
    console.log('Post slug:', post.slug);
    
    const response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: 'POST',
      body: params,
    });

    const data = await response.json();
    
    if (!response.ok || data.error) {
      const msg = data.error?.message || `HTTP ${response.status}`;
      console.error('❌ Facebook post failed:', msg);
      console.error('Full error:', data.error);
      return { ok: false, error: msg };
    }

    console.log('✅ Successfully posted to Facebook!');
    console.log('Post ID:', data.id);
    return { ok: true, id: data.id };
  } catch (err) {
    console.error('❌ Error posting to Facebook:', err);
    return { ok: false, error: String(err) };
  }
}

postToFacebook().then(result => {
  if (result.ok) {
    console.log('\n✅ SUCCESS! Now update the KV store with facebookPosted=true');
    console.log('You can do this by visiting: https://immersive.adduckivity.com/content/edit?slug=asset-05');
    console.log('And making a small edit to trigger the save endpoint with the flag set.');
  } else {
    console.log('\n❌ FAILED: Check your Facebook credentials and permissions');
    console.log('Make sure FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID are set correctly');
  }
  process.exit(result.ok ? 0 : 1);
});
