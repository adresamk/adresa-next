import { getUser } from "@/lib/auth";
import { getCurrentSession } from "@/lib/sessions";
import { cookies } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  agencyLogoUpload: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req, files }) => {
      // This code runs on your server before upload
      //   const user = await auth(req);
      const { session, account } = await getCurrentSession();

      // If you throw, the user will not be able to upload
      if (!account) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { accountUuid: account.uuid, agencyId: account.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for accountUuid:", metadata.accountUuid);

      console.log("file url", file.url);
      console.log("!!! Agency Id !!!", metadata.agencyId);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        agencyId: metadata.agencyId,
      };
    }),
  listingImagesUpload: f({
    image: { maxFileSize: "4MB", maxFileCount: 15 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, files }) => {
      // This code runs on your server before upload
      //   const user = await auth(req);
      const user = await getUser();
      const cookieStore = await cookies();
      const listingId = cookieStore.get("listingId")?.value;

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id, listingId: listingId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
      console.log("!!! Listing Id !!!", metadata.listingId);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        userId: metadata.userId,
        listingId: metadata.listingId,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
