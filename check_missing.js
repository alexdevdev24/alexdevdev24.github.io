const fs = require('fs');
const path = require('path');

// Read the file
const dataPath = '/home/alex/Bureau/alexdevdev24.github.io/data.js';
let content = fs.readFileSync(dataPath, 'utf8');

// Strip the variable declaration to make it valid JSON if possible, or just eval it (safe enough here as it is local file)
// "const examData = [...]" -> we can just eval the content and access examData
// But eval might be tricky if it has comments or other things.
// Let's try to just find all "number": X patterns.

// Actually, node can handle it if I append module.exports
// But I don't want to modify the file.
// I'll just use eval in a safe context or regex.

// Regex approach:
const regex = /"number":\s*(\d+)/g;
let match;
const numbers = [];

while ((match = regex.exec(content)) !== null) {
    numbers.push(parseInt(match[1]));
}

numbers.sort((a, b) => a - b);

const missing = [];
const duplicate = [];
const unexpected = [];

if (numbers.length === 0) {
    console.log("No numbers found!");
    process.exit(1);
}

const max = numbers[numbers.length - 1]; // Should be 210 based on previous turns

console.log(`Found ${numbers.length} questions. Max number found: ${max}`);

let expected = 1;
for (let i = 0; i < numbers.length; i++) {
    const current = numbers[i];

    // Check for duplicates
    if (i > 0 && current === numbers[i - 1]) {
        duplicate.push(current);
        continue; // Skip expected increment if duplicate? No, just continue.
    }

    // Check for gaps
    while (expected < current) {
        missing.push(expected);
        expected++;
    }

    expected = current + 1;
}

// Check if we didn't reach 210 (if user expects 210)
if (expected <= 210) {
    while (expected <= 210) {
        missing.push(expected);
        expected++;
    }
}

if (missing.length > 0) {
    console.log("Missing Answer Numbers:", missing);
} else {
    console.log("No missing numbers found up to " + (expected - 1));
}

if (duplicate.length > 0) {
    console.log("Duplicate Answer Numbers:", duplicate);
}
