import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawText = fs.readFileSync(path.join(__dirname, 'raw_prices.txt'), 'utf-8');
const lines = rawText.split('\n');

const sanePrices = {};

for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const match = line.match(/^(.*?)\s+(\d+)\s+(\d+)\s+(Common|Uncommon|Rare|Very Rare|Legendary)$/i);
    if (match) {
        let name = match[1].trim().toLowerCase();
        let price = parseInt(match[2], 10);
        sanePrices[name] = price;
    } else {
        console.warn('Could not parse line:', line);
    }
}

const outputPath = path.join(__dirname, '..', 'data', 'sane_prices.json');
fs.writeFileSync(outputPath, JSON.stringify(sanePrices, null, 2));

console.log(`Parsed ${Object.keys(sanePrices).length} Sane Magical Prices. Saved to data/sane_prices.json`);
