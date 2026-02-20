#!/usr/bin/env node
/**
 * upload-photos.js
 *
 * Uploads photos from photos-staging/ to Cloudflare R2 bucket.
 * Uses wrangler CLI for R2 operations.
 *
 * Prerequisites:
 *   1. npm install -g wrangler
 *   2. wrangler login
 *   3. Create R2 bucket: wrangler r2 bucket create chunlin-travel
 *   4. Configure custom domain in Cloudflare Dashboard
 *
 * Usage:
 *   npm run upload-photos
 *   npm run upload-photos -- --dry-run    # Preview without uploading
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ Configuration ============
const STAGING_DIR = path.join(__dirname, '../photos-staging');
const R2_BUCKET = 'chunlin-travel';
const R2_BASE_URL = 'https://img.chunlin.ch';  // Custom domain for R2
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const DRY_RUN = process.argv.includes('--dry-run');
// =======================================

function getExistingR2Objects(prefix) {
    try {
        const output = execSync(
            `wrangler r2 object list ${R2_BUCKET} --prefix="${prefix}" 2>/dev/null`,
            { encoding: 'utf8', timeout: 30000 }
        );
        const result = JSON.parse(output);
        return new Set((result.objects || []).map(o => o.key));
    } catch {
        // If listing fails, assume nothing exists (upload all)
        return new Set();
    }
}

function uploadFile(localPath, r2Key) {
    if (DRY_RUN) {
        console.log(`  [DRY RUN] Would upload: ${r2Key}`);
        return true;
    }
    try {
        execSync(
            `wrangler r2 object put "${R2_BUCKET}/${r2Key}" --file="${localPath}" --content-type="image/jpeg"`,
            { encoding: 'utf8', timeout: 60000, stdio: 'pipe' }
        );
        return true;
    } catch (err) {
        console.error(`  ❌ Failed to upload ${r2Key}: ${err.message}`);
        return false;
    }
}

function main() {
    console.log('📤 Travel Photo Uploader → Cloudflare R2');
    console.log(`  Bucket:  ${R2_BUCKET}`);
    console.log(`  Staging: ${STAGING_DIR}`);
    console.log(`  CDN URL: ${R2_BASE_URL}`);
    if (DRY_RUN) console.log('  ⚠️  DRY RUN MODE — no files will be uploaded');
    console.log('');

    // Check wrangler is available
    try {
        execSync('wrangler --version', { stdio: 'pipe' });
    } catch {
        console.error('❌ wrangler CLI not found. Install with: npm install -g wrangler');
        console.error('   Then login with: wrangler login');
        process.exit(1);
    }

    // Check staging directory
    if (!fs.existsSync(STAGING_DIR)) {
        fs.mkdirSync(STAGING_DIR, { recursive: true });
        console.log('📁 Created photos-staging/ directory.');
        console.log('   Add photo directories like: photos-staging/tokyo-2023/');
        return;
    }

    const dirs = fs.readdirSync(STAGING_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    if (dirs.length === 0) {
        console.log('ℹ️  No directories found in photos-staging/');
        console.log('   Create directories like: photos-staging/tokyo-2023/');
        return;
    }

    let totalUploaded = 0;
    let totalSkipped = 0;
    let totalFailed = 0;

    for (const dir of dirs) {
        const dirPath = path.join(STAGING_DIR, dir);
        const files = fs.readdirSync(dirPath)
            .filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
            .sort();

        if (files.length === 0) {
            console.log(`⏭  ${dir}: no images`);
            continue;
        }

        console.log(`📸 ${dir}: ${files.length} photos`);

        // Check which files already exist in R2
        const existing = getExistingR2Objects(`travel/${dir}/`);

        for (const file of files) {
            const r2Key = `travel/${dir}/${file}`;
            const localPath = path.join(dirPath, file);

            if (existing.has(r2Key)) {
                console.log(`  ⏭ ${file} (already exists)`);
                totalSkipped++;
                continue;
            }

            process.stdout.write(`  ⬆ ${file}...`);
            if (uploadFile(localPath, r2Key)) {
                console.log(' ✅');
                totalUploaded++;
            } else {
                totalFailed++;
            }
        }
    }

    console.log('');
    console.log('─'.repeat(40));
    console.log(`✅ Uploaded: ${totalUploaded}`);
    console.log(`⏭  Skipped:  ${totalSkipped} (already in R2)`);
    if (totalFailed > 0) console.log(`❌ Failed:   ${totalFailed}`);
    console.log('');

    if (totalUploaded > 0) {
        console.log('💡 Next steps:');
        console.log('   1. Run: npm run process-photos');
        console.log('   2. Edit travel-data.json if needed');
        console.log('   3. git commit & push');
    }
}

main();
