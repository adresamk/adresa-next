import { createListingsFromWebhook } from "@/server/actions/listing.actions";
import { NextRequest, NextResponse } from "next/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { FileEsque } from "uploadthing/types";

const utapi = new UTApi();

async function processExternalImage(imageUrl: string) {
  try {
    // Fetch the image as a stream
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${imageUrl}`);

    // Get the content type and create a unique filename
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${contentType.split("/")[1]}`;

    // Convert stream to blob
    const blob = await response.blob();

    // Upload to UploadThing
    const result = await utapi.uploadFiles([
      {
        name: filename,
        type: contentType,
        size: blob.size,
        // data: Blob,
      },
    ] as FileEsque[]);

    if (!result[0].data) {
      throw new Error("Upload failed");
    }

    // Return the new UploadThing URL and other metadata
    return {
      url: result[0].data.url,
      key: result[0].data.key,
      name: filename,
      size: blob.size,
    };
  } catch (error) {
    console.error("Image processing error:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { listingsToProcess, agencySlug } = await req.json();

    if (!Array.isArray(listingsToProcess)) {
      return NextResponse.json(
        { error: "Data must be an array" },
        { status: 400 },
      );
    }

    // Process all listings and their images
    const processedData = await Promise.all(
      listingsToProcess.map(async (listing) => {
        // Process images if they exist
        if (listing.images && Array.isArray(listing.images)) {
          const processedImages = await Promise.all(
            listing.images.map(async (image: { url: string }) => {
              if (typeof image.url === "string") {
                const processedImage = await processExternalImage(image.url);
                if (processedImage) {
                  return {
                    ...image,
                    url: processedImage.url,
                    key: processedImage.key,
                    name: processedImage.name,
                    size: processedImage.size,
                  };
                }
              }
              return null;
            }),
          );

          // Filter out any failed image processing
          const validImages = processedImages.filter((img) => img !== null);

          return {
            ...listing,
            images: validImages,
            mainImage: validImages[0] || {}, // Set first image as main image
          };
        }

        return listing;
      }),
    );

    const result = await createListingsFromWebhook(processedData, agencySlug);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Add rate limiting if needed
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "80mb", // This size limit applies to the entire request body
    },
  },
};

// Note: To enforce individual image size limits, implement validation logic within the request handler instead of relying solely on bodyParser sizeLimit.
