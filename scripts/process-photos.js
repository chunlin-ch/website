#!/usr/bin/env node
/**
 * process-photos.js
 *
 * Scans photos in photos-staging/{location-id}/ directories,
 * extracts EXIF GPS coordinates & date, and generates/updates travel-data.json.
 *
 * Photo URLs point to Cloudflare R2 CDN (or local /travel/ for demos).
 *
 * Usage:
 *   npm run process-photos
 *   npm run process-photos -- --local    # Use local paths instead of R2
 *
 * Directory structure expected:
 *   photos-staging/
 *     tokyo-2023/
 *       cover.jpg        <- Cover image (first image or named 'cover.*')
 *       IMG_001.jpg      <- Photos with EXIF data
 *       IMG_002.jpg
 *     chengdu-2024/
 *       ...
 *
 * If a photo has GPS EXIF data, coordinates are extracted automatically.
 * If not, the location entry is marked with autoGeo: false and you can
 * manually set coordinates via the /travel/admin page.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExifReader from 'exifreader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ Configuration ============
const USE_LOCAL = process.argv.includes('--local');
const STAGING_DIR = path.join(__dirname, '../photos-staging');
const OUTPUT_FILE = path.join(__dirname, '../src/data/travel-data.json');
const R2_BASE_URL = 'https://img.chunlin.ch'; // Change to your R2 custom domain
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];
// =======================================

function photoUrl(locationId, fileName) {
    if (USE_LOCAL) {
        return `/travel/${locationId}/${fileName}`;
    }
    return `${R2_BASE_URL}/travel/${locationId}/${fileName}`;
}

// Load existing data to preserve manual edits
function loadExistingData() {
    try {
        const raw = fs.readFileSync(OUTPUT_FILE, 'utf8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

// Extract GPS coordinates from EXIF
function extractGPS(tags) {
    try {
        const lat = tags.GPSLatitude?.description;
        const lng = tags.GPSLongitude?.description;
        if (lat !== undefined && lng !== undefined) {
            return [parseFloat(lat), parseFloat(lng)];
        }
    } catch {
        // Ignore EXIF parsing errors
    }
    return null;
}

// Extract date from EXIF
function extractDate(tags) {
    try {
        const dateStr = tags.DateTimeOriginal?.description || tags.DateTime?.description;
        if (dateStr) {
            // Format: "2023:10:15 14:30:00" → "2023-10"
            const parts = dateStr.split(/[: ]/);
            return `${parts[0]}-${parts[1]}`;
        }
    } catch {
        // Ignore
    }
    return null;
}

// Process a single photo file
async function processPhoto(filePath, locationId) {
    try {
        const buffer = fs.readFileSync(filePath);
        const tags = ExifReader.load(buffer);
        const gps = extractGPS(tags);
        const date = extractDate(tags);
        const fileName = path.basename(filePath);

        return {
            src: photoUrl(locationId, fileName),
            caption: fileName.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
            autoGeo: gps !== null,
            coordinates: gps,
            date: date,
        };
    } catch (err) {
        const fileName = path.basename(filePath);
        console.warn(`  ⚠ Could not read EXIF from ${fileName}: ${err.message}`);
        return {
            src: photoUrl(locationId, fileName),
            caption: fileName.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
            autoGeo: false,
            coordinates: null,
            date: null,
        };
    }
}

// Process a location directory
async function processLocation(locationDir) {
    const locationId = path.basename(locationDir);
    const files = fs.readdirSync(locationDir)
        .filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
        .sort();

    if (files.length === 0) {
        console.log(`  ⏭ Skipping ${locationId} (no images)`);
        return null;
    }

    console.log(`  📸 Processing ${locationId}: ${files.length} photos`);

    // Determine cover image
    const coverFile = files.find(f => f.toLowerCase().startsWith('cover')) || files[0];
    const coverImage = photoUrl(locationId, coverFile);

    // Process all photos
    const photos = [];
    let locationCoords = null;
    let locationDate = null;

    for (const file of files) {
        const filePath = path.join(locationDir, file);
        const photoData = await processPhoto(filePath, locationId);
        photos.push({
            src: photoData.src,
            caption: photoData.caption,
            autoGeo: photoData.autoGeo,
        });

        // Use first photo's GPS as location coordinates (if available)
        if (!locationCoords && photoData.coordinates) {
            locationCoords = photoData.coordinates;
        }
        // Use earliest date
        if (!locationDate && photoData.date) {
            locationDate = photoData.date;
        }
    }

    const autoGeo = locationCoords !== null;
    const prettyName = locationId
        .split('-')
        .slice(0, -1) // Remove year suffix
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return {
        id: locationId,
        name: prettyName,
        country: '',  // Manual entry
        coordinates: locationCoords || [0, 0],
        date: locationDate || '',
        coverImage,
        photos,
        description: '',  // Manual entry
        blogSlug: null,
        autoGeo,
    };
}

// Main
async function main() {
    console.log('🌍 Travel Photo Processor');
    console.log(`  Input:  ${TRAVEL_DIR}`);
    console.log(`  Output: ${OUTPUT_FILE}`);
    console.log('');

    if (!fs.existsSync(STAGING_DIR)) {
        console.log('  📁 Creating photos-staging/ directory...');
        fs.mkdirSync(STAGING_DIR, { recursive: true });
        console.log('  ✅ Created. Add photo directories and run again.');
        return;
    }

    const existingData = loadExistingData();
    const existingMap = new Map(existingData.map(loc => [loc.id, loc]));

    const dirs = fs.readdirSync(STAGING_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => path.join(STAGING_DIR, d.name));

    if (dirs.length === 0) {
        console.log('  ℹ No location directories found in photos-staging/');
        console.log('  💡 Create directories like: photos-staging/tokyo-2023/');
        return;
    }

    const locations = [];
    for (const dir of dirs) {
        const location = await processLocation(dir);
        if (!location) continue;

        // Merge with existing data (preserve manual edits)
        const existing = existingMap.get(location.id);
        if (existing) {
            location.name = existing.name || location.name;
            location.country = existing.country || location.country;
            location.description = existing.description || location.description;
            location.blogSlug = existing.blogSlug || location.blogSlug;
            // Only override coordinates if new data has autoGeo and existing didn't
            if (!location.autoGeo && existing.coordinates) {
                location.coordinates = existing.coordinates;
            }
        }

        locations.push(location);

        if (!location.autoGeo) {
            console.log(`    ⚠ No GPS data found – manually set coordinates in travel-data.json`);
        }
    }

    // Sort by date descending
    locations.sort((a, b) => b.date.localeCompare(a.date));

    // Ensure output directory exists
    const dataDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(locations, null, 2));
    console.log('');
    console.log(`  ✅ Generated ${locations.length} locations to travel-data.json`);

    // Report stats
    const autoGeo = locations.filter(l => l.autoGeo).length;
    const manualGeo = locations.length - autoGeo;
    console.log(`     📍 Auto-positioned: ${autoGeo}`);
    if (manualGeo > 0) {
        console.log(`     ✏️  Manual positioning needed: ${manualGeo}`);
    }
}

main().catch(console.error);
