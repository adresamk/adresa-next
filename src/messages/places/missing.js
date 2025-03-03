// compare-place-keys.js

const fs = require("fs");

// Read the JSON files
const mkPlaces = JSON.parse(fs.readFileSync("./mk.places.json", "utf8"));
const enPlaces = JSON.parse(fs.readFileSync("./en.places.json", "utf8"));
const alPlaces = JSON.parse(fs.readFileSync("./al.places.json", "utf8"));

// Get all keys from each file
const mkKeys = new Set(Object.keys(mkPlaces));
const enKeys = new Set(Object.keys(enPlaces));
const alKeys = new Set(Object.keys(alPlaces));

// Find missing keys in English translation
const missingInEn = [...mkKeys].filter((key) => !enKeys.has(key));
if (missingInEn.length > 0) {
  console.log("\nKeys missing in English translation:");
  missingInEn.forEach((key) => {
    console.log(`${key}: "${mkPlaces[key]}"`);
  });
}

// Find missing keys in Albanian translation
const missingInAl = [...mkKeys].filter((key) => !alKeys.has(key));
if (missingInAl.length > 0) {
  console.log("\nKeys missing in Albanian translation:");
  missingInAl.forEach((key) => {
    console.log(`${key}: "${mkPlaces[key]}"`);
  });
}

// Find extra keys in English translation (not in Macedonian)
const extraInEn = [...enKeys].filter((key) => !mkKeys.has(key));
if (extraInEn.length > 0) {
  console.log("\nExtra keys in English translation:");
  extraInEn.forEach((key) => {
    console.log(`${key}: "${enPlaces[key]}"`);
  });
}

// Find extra keys in Albanian translation (not in Macedonian)
const extraInAl = [...alKeys].filter((key) => !mkKeys.has(key));
if (extraInAl.length > 0) {
  console.log("\nExtra keys in Albanian translation:");
  extraInAl.forEach((key) => {
    console.log(`${key}: "${alPlaces[key]}"`);
  });
}

// Print summary
console.log("\nSummary:");
console.log(`Total keys in Macedonian: ${mkKeys.size}`);
console.log(`Total keys in English: ${enKeys.size}`);
console.log(`Total keys in Albanian: ${alKeys.size}`);
console.log(`Missing in English: ${missingInEn.length}`);
console.log(`Missing in Albanian: ${missingInAl.length}`);
console.log(`Extra in English: ${extraInEn.length}`);
console.log(`Extra in Albanian: ${extraInAl.length}`);
