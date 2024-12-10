import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";
import { UTApi } from "uploadthing/server";
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // Apply an (optional) custom config:
  // config: { ... },
});

export async function DELETE(request: Request) {
  const data = await request.json();

  const newUrl = data.url.substring(data.url.lastIndexOf("/") + 1);
  const key = data.key;
  console.log("newUrl", newUrl);
  const utapi = new UTApi();
  if (key) {
    await utapi.deleteFiles(key);
  } else {
    await utapi.deleteFiles(newUrl);
  }

  return Response.json({ message: "ok" });
}
// this is my delete function in client component:

// const deleteValue = async () => {
//   await axios.delete("api/uploadthing", {
//     data: {
//       url: value,
//     },
//   });
// };
