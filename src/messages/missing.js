const fs = require("fs");
const path = require("path");

function findMissingKeys(sourceObj, targetObj, currentPath = "") {
  const missingKeys = [];

  function traverse(source, target, keyPath) {
    for (const key of Object.keys(source)) {
      const newPath = keyPath ? `${keyPath}.${key}` : key;

      // Check if key exists in target
      if (!(key in target)) {
        missingKeys.push({
          path: newPath,
          value: source[key],
        });
        continue;
      }

      // If both are objects, traverse deeper
      if (
        source[key] &&
        target[key] &&
        typeof source[key] === "object" &&
        typeof target[key] === "object" &&
        !Array.isArray(source[key]) &&
        !Array.isArray(target[key])
      ) {
        traverse(source[key], target[key], newPath);
      }
    }
  }

  traverse(sourceObj, targetObj, currentPath);
  return missingKeys;
}

// Helper to count total keys in an object recursively
function countTotalKeys(obj) {
  let count = 0;

  function traverse(current) {
    if (current && typeof current === "object" && !Array.isArray(current)) {
      for (const key of Object.keys(current)) {
        count++;
        traverse(current[key]);
      }
    }
  }

  traverse(obj);
  return count;
}

try {
  // Load the JSON files
  const mkJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "mk.json"), "utf8"),
  );
  const enJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "en.json"), "utf8"),
  );
  const alJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "al.json"), "utf8"),
  );

  // Get total key counts
  const mkTotal = countTotalKeys(mkJson);
  const enTotal = countTotalKeys(enJson);
  const alTotal = countTotalKeys(alJson);

  console.log("\nTotal keys in each file:");
  console.log(`Macedonian: ${mkTotal} keys`);
  console.log(`English: ${enTotal} keys`);
  console.log(`Albanian: ${alTotal} keys`);

  // Find missing keys in English translation
  const missingInEn = findMissingKeys(mkJson, enJson);

  // Find missing keys in Albanian translation
  const missingInAl = findMissingKeys(mkJson, alJson);

  // Log results
  if (missingInEn.length > 0) {
    console.log("\nMissing keys in English translation:");
    missingInEn.forEach(({ path, value }) => {
      console.log(`${path}: "${value}"`);
    });
  } else {
    console.log("\nNo missing keys in English translation");
  }

  if (missingInAl.length > 0) {
    console.log("\nMissing keys in Albanian translation:");
    missingInAl.forEach(({ path, value }) => {
      console.log(`${path}: "${value}"`);
    });
  } else {
    console.log("\nNo missing keys in Albanian translation");
  }

  // Log summary
  console.log("\nSummary:");
  console.log(`Total missing in English: ${missingInEn.length} keys`);
  console.log(`Total missing in Albanian: ${missingInAl.length} keys`);
} catch (error) {
  console.error("Error:", error.message);
}
