import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDirectory = path.join(__dirname, '../content/posts');
const outputFile = path.join(__dirname, '../src/data/posts.json');

// Ensure output directory exists is handled by fs.writeFileSync if parent exists,
// but let's make sure src/data exists.
const dataDir = path.join(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

function getPosts() {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                ...data,
                content, // We include content for now. For large sites, might separate list vs detail JSON.
            };
        })
        .filter(post => post.published); // Filter out drafts if 'published: false'

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

const posts = getPosts();
fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));

console.log(`Generated ${posts.length} posts to ${outputFile}`);
