import { createListingsFromWebhook } from "@/server/actions/listing.actions";
import { ExternalListingData } from "@/types/listing.types";
import { NextRequest, NextResponse } from "next/server";
import { UploadThingError, UTApi } from "uploadthing/server";
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
    const body = await req.json();
    console.log("Received webhook body:", body); // Debug incoming data

    const { listingsToProcess, agencySlug } = body;

    if (!listingsToProcess || !agencySlug) {
      console.log("Missing required fields:", {
        listingsToProcess,
        agencySlug,
      });
      return NextResponse.json(
        { error: "Missing required fields: listingsToProcess or agencySlug" },
        { status: 400 },
      );
    }

    if (!Array.isArray(listingsToProcess)) {
      console.log("Invalid listingsToProcess format:", listingsToProcess);
      return NextResponse.json(
        { error: "Data must be an array" },
        { status: 400 },
      );
    }

    console.log("Processing images for listings:", listingsToProcess.length);
    for (const listing of listingsToProcess) {
      if (listing.images && Array.isArray(listing.images)) {
        try {
          const uploadedFiles = await utapi.uploadFilesFromUrl(
            listing.images
              .filter((imgUrl: string) => imgUrl !== "javascript:void(0)")
              .map((imgUrl: string) => imgUrl),
          );
          // console.log("Uploaded files:", uploadedFiles); // Debug uploaded files
          // @ts-ignore

          listing.images = uploadedFiles.map((file) => file.data);
          // @ts-ignore

          listing.mainImage = listing.images[0];
        } catch (uploadError) {
          console.log(listing.images);
          if (uploadError instanceof UploadThingError) {
            console.log("UploadThingError", uploadError);
          }
          // const e = uploadError as Error;
          // console.error("Image upload error:", uploadError);
          // console.error(
          //   "Image upload error:",
          //   e.message,
          //   e.cause,
          //   e.name,
          //   e.stack,
          // );
          // Continue with other listings even if one fails
        }
      }
    }

    console.log("Calling createListingsFromWebhook with:", {
      listingsCount: listingsToProcess.length,
      agencySlug,
    });

    const result = await createListingsFromWebhook(
      listingsToProcess,
      agencySlug,
    );

    console.log("createListingsFromWebhook result:", result);

    if (!result) {
      console.error("createListingsFromWebhook returned null/undefined");
      return NextResponse.json(
        { error: "Failed to create listings" },
        { status: 500 },
      );
    }

    if (!result.success) {
      console.error("createListingsFromWebhook error:", result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Ensure we're returning a valid payload
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Webhook error details:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error,
      },
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
  const uploadedFiles = await utapi.uploadFilesFromUrl([
    "https://media.pazar3.mk/Image/7590180b-e8ef-43f3-bdec-47fa0752c514/20250225/false/false/1280/960/komoten-stan-od-116m2-itno-poradi-preselba-vo-drug-grad.jpeg?noLogo=true",
  ]);
  console.log("uploadedFiles", uploadedFiles);
  const testObj = {
    url: "https://www.pazar3.mk/oglas/zivealista/stanovi/izdavanje/skopje/skopje-opstina/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate/2825258",
    mkTitle: "Nov dvosoben 56m2 kaj hotel Kontinental-East Gate",
    price: "370",
    address:
      "Džon Kenedi, Топаана, Chair, Skopje, Municipality of Chair, City of Skopje, 1009, North Macedonia",
    mkDescription:
      "Sifra> 23711\n\nSe izdava NOV kompletno namesten dvosoben 56m2 na 1- vi kat vo novite zgradi kaj hotel Kontinental - East Gate, edna spalna, terasa, juzna orientacija, stanot e ureden so nov mebel i vednas vseliv !\n2 parking mesta!\nCena: 370 evra\n\nKontakt:\n077 705 108\n075 534 820\n02 3051 300\nAgencija Doma Dom\nwww.domadom.mk\ninfo@domadom.mk\nstanovi Skopje-Avtokomanda/\nстанови Скопје-Автокоманда\nОпис на линк\nReal estate DOMA DOM\nАгенцијата за недвижности Real Estate DOMA DOM е доверлива агенција за недвижности во Скопје, Македонија, која е посветена на помагање на своите клиенти во наоѓање на совршениот дом или инвестициска можност. Со долгогодишно искуство во областа на недвижности, Агенцијата за недвижности DOMA DOM Ви нуди широк избор на недвижности - куќи, станови, викендички, и деловни простори, како и други имоти ширум Македонија.\n\nКако агенција на која може да и верувате, Real Estate DOMA DOM поседува тим од професионалци кои се секогаш подготвени да Ви помогнат во секој чекор од процесот, било да сте во потрага по нов стан, куќа или имот за инвестиција. Секој клиент добива индивидуален пристап и целосна поддршка со цел постигнување на најдоброто можно решение при купување, издавање или продажба на куќи и станови.\n\nПонудата на недвижности вклучува различни типови на имоти во сите делови на Скопје и пошироко, така што без разлика дали барате нов дом или деловен простор, Real Estate DOMA DOM е тука за Вас. Преку Агенцијата за недвижности DOMA DOM, можете да ги пронајдете најдобрите недвижности кои ќе ги исполнат Вашите потреби и очекувања.\n\nДоверете се на агенција со искуство, професионализам и квалитетна услуга во областа на недвижности. (stanovi vo Skopje, Centar, Karpos,Taftalidze)\n\nОвластен агент за MoneyGram -money transfer,\nПосети ја страната на нашата продавница\nstr.Mitropolit Teodosij Gologanov nb.72b lok.18 Прикажи на мапата\n00389023051300\nhttps://www.domadom.mk",
    images: [
      "https://media.pazar3.mk/Image/61202d00626b465b9a1f0ec1fb617a1d/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
      "https://media.pazar3.mk/Image/70fcb75f0cd14c5dbb083bba78560d52/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
      "https://media.pazar3.mk/Image/7d2ef8563fdb4c6693091cae3bcba9f3/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
      "https://media.pazar3.mk/Image/31113f30da5d4db9bd98504ba507ae22/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
      "https://media.pazar3.mk/Image/ee8130012e6549c382513f054637d00a/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
      "https://media.pazar3.mk/Image/207fdb8d8e4b48f58378f9d854954d5d/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
      "https://media.pazar3.mk/Image/708be54be21f4aa6be4d5cd907889f4d/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
    ],
    mainImage:
      "https://media.pazar3.mk/Image/61202d00626b465b9a1f0ec1fb617a1d/20250221/false/false/1280/960/nov-dvosoben-56m2-kaj-hotel-kontinental-east-gate.jpeg?noLogo=true",
    externalRef: "Sifra&gt; 23711",
    externalRefCleared: "23711",
    publishedAtDate: "фев. 21 2025",
    publishedAtTime: "02:15",
    tagTransactionType: "N/A",
    tagAddressData: "Avtokomanda -East Gate",
    tagRooms: "2",
    tagArea: "56 m2",
    tagLocation: "Скопје, Скопjе",
    tags: [
      {
        label: "Број на соби:",
        value: "2",
      },
      {
        label: "Состојба:",
        value: "Ново",
      },
      {
        label: "Адреса:",
        value: "Avtokomanda -East Gate",
      },
      {
        label: "Површина:",
        value: "56 m2",
      },
      {
        label: "За живеалиштето:",
        value:
          "Балкон / Тераса, Лифт, Паркинг простор / Гаража, Нова градба, Наместен, Интерфон",
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
        value: "Скопје, Скопjе",
      },
    ],
    lastBreadcrumb: "https://www.pazar3.mk/oglasi/zivealista/stanovi",
    coordinates: "21.439862 42.013463",
    addressData:
      "Džon Kenedi, Топаана, Chair, Skopje, Municipality of Chair, City of Skopje, 1009, North Macedonia",
  } as any;
  const result = await createListingsFromWebhook([testObj], "domadom");
  return NextResponse.json(result);
}
// Note: To enforce individual image size limits, implement validation logic within the request handler instead of relying solely on bodyParser sizeLimit.
