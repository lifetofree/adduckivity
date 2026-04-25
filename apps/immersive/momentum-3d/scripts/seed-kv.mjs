import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const contentDir = join(__dirname, '../public/content')
const KV_ID = 'a07209b5ad9a4972aa82a30d0af3071e'

function readingTime(content) {
  const words = content.replace(/[#*`[\]]/g, '').split(/\s+/).filter(Boolean).length
  const mins = Math.ceil(words / 200)
  return mins < 1 ? '< 1 min read' : `${mins} min read`
}

const files = readdirSync(contentDir).filter(f => f.endsWith('.md'))

for (const file of files) {
  const slug = file.replace(/\.md$/, '')
  const raw = readFileSync(join(contentDir, file), 'utf8')
  const { data, content } = matter(raw)

  const post = {
    slug,
    title:        data.title        || '',
    date:         data.date         || new Date().toISOString().split('T')[0],
    category:     data.category     || 'uncategorized',
    scene:        data.scene        || 'default',
    mood:         data.mood         || 'neutral',
    excerpt:      data.excerpt      || '',
    tags:         data.tags         || [],
    featuredImage: data.featuredImage || '',
    author:       data.author       || 'Adduckivity',
    readingTime:  data.readingTime  || readingTime(content),
    status:       data.status === 'published' ? 'published' : 'draft',
    content,
  }

  const json = JSON.stringify(post)
  execSync(`wrangler kv key put "post:${slug}" '${json.replace(/'/g, "'\\''")}' --namespace-id ${KV_ID}`)
  console.log(`✓ Seeded: ${slug} (${post.status})`)
}

console.log(`\nDone — seeded ${files.length} posts to KV`)
