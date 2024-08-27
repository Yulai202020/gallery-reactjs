import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import sharp from 'sharp';
import fetch from 'node-fetch';

async function downloadFile(url, destPath) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download file from ${url}`);
    const fileStream = fs.createWriteStream(destPath);
    await new Promise((resolve, reject) => {
        response.body.pipe(fileStream);
        response.body.on('error', reject);
        fileStream.on('finish', resolve);
    });
}

async function processPhotos(photoUrls) {
    fs.mkdirSync('output', { recursive: true });

    for (const [index, url] of photoUrls.entries()) {
        try {
            fs.mkdirSync(path.join('output', String(index)), { recursive: true });
            const inputPath = 'input.jpg';
            await downloadFile(url, inputPath);
            await sharp(inputPath).avif({ quality: 80 }).toFile(path.join('output', String(index), 'original.avif'));
            await sharp(inputPath).resize({ width: 800 }).avif({ quality: 80 }).toFile(path.join('output', String(index), '800w.avif'));
            await sharp(inputPath).resize({ width: 400 }).avif({ quality: 80 }).toFile(path.join('output', String(index), '400w.avif'));
            await sharp(inputPath).resize({ width: 200 }).avif({ quality: 80 }).toFile(path.join('output', String(index), '200w.avif'));
            await sharp(inputPath).resize({ width: 100 }).avif({ quality: 80 }).toFile(path.join('output', String(index), '100w.avif'));

            fs.unlinkSync(inputPath);
        } catch (err) {
            console.error(`Error processing file ${url}:`, err);
        }
    }
}

async function main() {
    try {
        const fileContents = fs.readFileSync('./config.yaml', 'utf8');
        const data = yaml.load(fileContents);

        if (Array.isArray(data.photos)) {
            await processPhotos(data.photos);
        } else {
            console.log('photos in config.yaml is not a list or does not exist.');
        }
    } catch (err) {
        console.error('Error reading config file or processing photos:', err);
    }
}

main();
