import { createListingsFromWebhook } from "@/server/actions/listing.actions";
import { ExternalListingData } from "@/types/listing.types";
import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  const testObj = {
    url: "https://www.pazar3.mk/oglas/zivealista/stanovi/izdavanje/skopje/centar/trosoben-stan-od-105m2-centar-grcka-amb/2120340",
    mkTitle: "Trosoben stan od 105m2 Centar Grcka Amb.",
    price: "450",
    address: "",
    mkDescription:
      "Sifra > 23 767\n\nSe izdava namesten trosoben stan od 105m2 vo Centar kaj Porta Bunjakovec, na 1- vi kat so lift, centralno parno, 2 spalni, kompletno opremena kujna, pogoden za 3-4 cimeri, studeni....\nCena: 450evra\n\nKontakt:\n077 705 108\n077 705 109\n02 0351-300\nAgencija Doma Dom\nwww.domadom.mk\ninfo@domadom.mk\nMoneyGram-moneytransfer\nОпис на линк\nReal estate DOMA DOM\nАгенцијата за недвижности Real Estate DOMA DOM е доверлива агенција за недвижности во Скопје, Македонија, која е посветена на помагање на своите клиенти во наоѓање на совршениот дом или инвестициска можност. Со долгогодишно искуство во областа на недвижности, Агенцијата за недвижности DOMA DOM Ви нуди широк избор на недвижности - куќи, станови, викендички, и деловни простори, како и други имоти ширум Македонија.\n\nКако агенција на која може да и верувате, Real Estate DOMA DOM поседува тим од професионалци кои се секогаш подготвени да Ви помогнат во секој чекор од процесот, било да сте во потрага по нов стан, куќа или имот за инвестиција. Секој клиент добива индивидуален пристап и целосна поддршка со цел постигнување на најдоброто можно решение при купување, издавање или продажба на куќи и станови.\n\nПонудата на недвижности вклучува различни типови на имоти во сите делови на Скопје и пошироко, така што без разлика дали барате нов дом или деловен простор, Real Estate DOMA DOM е тука за Вас. Преку Агенцијата за недвижности DOMA DOM, можете да ги пронајдете најдобрите недвижности кои ќе ги исполнат Вашите потреби и очекувања.\n\nДоверете се на агенција со искуство, професионализам и квалитетна услуга во областа на недвижности. (stanovi vo Skopje, Centar, Karpos,Taftalidze)\n\nОвластен агент за MoneyGram -money transfer,\nПосети ја страната на нашата продавница\nstr.Mitropolit Teodosij Gologanov nb.72b lok.18 Прикажи на мапата\n00389023051300\nhttps://www.domadom.mk",
    images: [
      "https://media.pazar3.mk/Image/a7c885a924f145b08b97f5354fdfcc24/20241107/false/false/1280/960/trosoben-stan-od-105m2-centar-grcka-amb.jpeg?noLogo=true",
      "https://media.pazar3.mk/Image/f65ecdf026f44211b5e1ad039bac082d/20241107/false/false/1280/960/trosoben-stan-od-105m2-centar-grcka-amb.jpeg?noLogo=true",
      "https://media.pazar3.mk/Image/7cd2e3884aa9461fabbaa87675a170d1/20241107/false/false/1280/960/trosoben-stan-od-105m2-centar-grcka-amb.jpeg?noLogo=true",
      "https://media.pazar3.mk/Image/6fd7dad2d53448a2bbeddd45e3826f51/20241107/false/false/1280/960/trosoben-stan-od-105m2-centar-grcka-amb.jpeg?noLogo=true",
      "https://media.pazar3.mk/Image/eed2a38e91e8485f92c9c6a06815f7e0/20241107/false/false/1280/960/trosoben-stan-od-105m2-centar-grcka-amb.jpeg?noLogo=true",
      "https://media.pazar3.mk/Image/ead3f8a16aab41a1ae9d319f9e53c906/20241107/false/false/1280/960/trosoben-stan-od-105m2-centar-grcka-amb.jpeg?noLogo=true",
    ],
    mainImage:
      "https://media.pazar3.mk/Image/a7c885a924f145b08b97f5354fdfcc24/20241107/false/false/1280/960/trosoben-stan-od-105m2-centar-grcka-amb.jpeg?noLogo=true",
    externalRef: "Sifra &gt; 23 767",
    externalRefCleared: "23767",
    publishedAtDate: "дек. 02 2024",
    publishedAtTime: "11:37",
    tagTransactionType: "N/A",
    tagAddressData: "Centar",
    tagRooms: "3",
    tagArea: "105 m2",
    tagLocation: "Центар, Скопjе",
    tags: [
      {
        label: "Број на соби:",
        value: "3",
      },
      {
        label: "Состојба:",
        value: "Користено - Во добра состојба",
      },
      {
        label: "Адреса:",
        value: "Centar",
      },
      {
        label: "Површина:",
        value: "105 m2",
      },
      {
        label: "За живеалиштето:",
        value: "Паркинг простор / Гаража",
      },
      {
        label: "Вид на оглас:",
        value: "Се изнајмува",
      },
      {
        label: "Огласено од:",
        value: "Продавница",
      },
      {
        label: "Локација:",
        value: "Центар, Скопjе",
      },
    ],
    coordinates: "",
    addressData: "",
  } as ExternalListingData;
  const result = await createListingsFromWebhook([testObj], "domadom");
  return NextResponse.json(result);
}
// Note: To enforce individual image size limits, implement validation logic within the request handler instead of relying solely on bodyParser sizeLimit.
