const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/products.ts');

try {
    let content = fs.readFileSync(filePath, 'utf8');
    console.log(`Read ${content.length} bytes.`);

    // Match priceMin: NUMBER,
    // Capture the indentation
    let matchCount = 0;
    const newContent = content.replace(/^(\s*)priceMin: (\d+),/gm, (match, indent, val) => {
        // Check if "price:" is already on the previous line?
        // It's hard to check previous line in replace callback.
        // But we can check if the output duplications.
        matchCount++;
        return `${indent}price: ${val},\n${indent}priceMin: ${val},`;
    });

    console.log(`Replaced ${matchCount} occurrences.`);

    // Cleanup potential duplicates (naive)
    // pattern: price: 123,\n[...]price: 123,
    // Actually if I run this on a file that already has some 'price:', it will create:
    // price: 450,
    // price: 450,
    // priceMin: 450,
    // We want to avoid that.

    // Safer approach:
    // 1. First remove ALL `price: \d+,` lines to start clean (except if I missed some manual ones that are unique? No, I assumed price=priceMin).
    // Actually, I manually added `price: 450` in Step 235.
    // If I remove all `price:`, I lose nothing if I regenerate them from `priceMin`.

    // Remove existing price lines
    const cleaned = content.replace(/^\s*price: \d+,\r?\n/gm, '');

    // Now apply the generation
    const finalContent = cleaned.replace(/^(\s*)priceMin: (\d+),/gm, (match, indent, val) => {
        return `${indent}price: ${val},\n${indent}priceMin: ${val},`;
    });

    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log('Successfully rewrote products.ts');

} catch (e) {
    console.error('Error:', e);
}
