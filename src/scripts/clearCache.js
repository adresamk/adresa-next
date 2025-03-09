import { unstable_cache } from "next/cache";

async function clearCache() {
  console.log("Clearing Next.js cache...");
  await unstable_cache.clear();
  console.log("Cache cleared successfully.");
}

clearCache()
  .catch((err) => {
    console.error("Error clearing cache:", err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
