# AI Assistant Rate Limit Fix

## Problem
AI Assistant in the content editor was hitting rate limits on every request.

## Root Cause Analysis

### 1. **Model Version Issues**
- **Client-side** (`lib/gemini.ts`): Used `gemini-2.0-flash-exp` (experimental model)
- **Server-side** (`api/ai/route.ts`): Used `gemini-2.0-flash` 
- **Issue**: Experimental models have much stricter rate limits

### 2. **Security Vulnerability**
- **Issue**: Client-side AI implementation exposed API keys via `NEXT_PUBLIC_GEMINI_API_KEY`
- **Risk**: API keys visible in browser, potential abuse

### 3. **No Rate Limiting**
- No protection against rapid successive requests
- No retry logic for transient failures
- Poor error messaging

## Solutions Implemented

### ✅ **1. Removed Client-Side AI Implementation**
```bash
# Deleted insecure file
rm src/lib/gemini.ts
```

### ✅ **2. Updated to Stable Model**
```typescript
// Before: gemini-2.0-flash (experimental)
// After:  gemini-1.5-flash (stable, better rate limits)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
```

### ✅ **3. Added Retry Logic**
```typescript
// Exponential backoff: 1s, 2s, 4s
async function ask(apiKey: string, prompt: string, retries = 2): Promise<string>
```

### ✅ **4. Implemented Rate Limiting**
```typescript
// Max 10 requests per minute per IP
const rateLimiter = new Map<string, { count: number; resetTime: number }>()
```

### ✅ **5. Improved Error Messages**
```typescript
// Before: "Rate limited — try again in 15s"
// After:  "AI is thinking too hard. Please wait 10-20 seconds and try again."
```

## Environment Configuration

### Development (.env.local)
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### Production (Cloudflare Pages Dashboard)
```
Settings → Environment Variables → GEMINI_API_KEY
```

## Testing

### Manual Testing Steps
1. Open content editor: `/content/edit?slug=test-post`
2. Try each AI assistant feature:
   - Title Suggestions
   - Auto Excerpt  
   - Outline
   - SEO Tips
   - Auto Tags
3. Rapid-fire multiple requests to test rate limiting

### Expected Behavior
- ✅ AI responses work consistently
- ✅ Rate limit message is user-friendly
- ✅ No API key errors in console
- ✅ Automatic retry on transient failures

## Rate Limits (Current)

### Google Gemini API (gemini-1.5-flash)
- **Free Tier**: 15 requests per minute
- **Paid Tier**: 150 requests per minute

### Application-Level Limits
- **Per IP**: 10 requests per minute
- **Retry Attempts**: 2 (with exponential backoff)
- **Total Timeout**: ~7 seconds maximum

## Monitoring

### Check Usage
```bash
# Google Cloud Console
# → APIs & Services → Dashboard → Gemini API
```

### Cloudflare Analytics
```
# Cloudflare Dashboard → Pages → immersive-adduckivity → Analytics
# Look for /api/ai request patterns
```

## Future Improvements

### Short-term
- [ ] Add caching for repeated requests
- [ ] Implement request queuing
- [ ] Add usage metrics dashboard

### Long-term  
- [ ] Consider upgrading to paid Gemini tier
- [ ] Implement streaming responses
- [ ] Add AI usage analytics

## Troubleshooting

### Still seeing rate limits?
1. **Check API key tier**: Free vs Paid
2. **Verify model**: Should be `gemini-1.5-flash`
3. **Check for loops**: Ensure no rapid retry loops in client code

### API key errors?
1. **Development**: Check `.env.local` has `GEMINI_API_KEY`
2. **Production**: Check Cloudflare Pages environment variables
3. **Format**: No quotes, just the raw key string

### Weird AI responses?
1. **Clear cache**: Restart dev server
2. **Check prompts**: Look at network tab in DevTools
3. **Model confusion**: Ensure only `gemini-1.5-flash` is used

## Files Modified
- ✅ `src/app/api/ai/route.ts` - Enhanced with retry logic & rate limiting
- ❌ `src/lib/gemini.ts` - DELETED (security risk)
- 📝 `.env.local` - Ensure `GEMINI_API_KEY` is set

## Deployment
```bash
# Test locally first
npm run dev

# Then deploy
npm run deploy
```

---

*Last updated: 2026-04-29*
*Fix implemented by: AI Code Review*
