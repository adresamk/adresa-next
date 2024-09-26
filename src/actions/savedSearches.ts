"use server";

import { validateRequest } from "@/lib/auth";
import prismadb from "@/lib/db";
import { redirect } from "next/navigation";

export async function getMySavedSearches() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/");
  }

  const savedSearches = await prismadb.savedSearch.findMany({
    where: {
      userId: user.id,
    },
  });

  return savedSearches;
}

export async function createSavedSearch(ps: any, formData: FormData) {
  console.log("ss", formData);

  const { user } = await validateRequest();
  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }
  const name = formData.get("name");
  const searchParams = formData.get("searchParams");
  const isNotificationOn = formData.get("isNotificationOn");
  const notificationInterval = formData.get("notificationInterval");

  // validate the request
  if (
    typeof name !== "string" ||
    name.length < 3 ||
    name.length > 50 ||
    typeof searchParams !== "string" ||
    typeof isNotificationOn !== "string" ||
    typeof notificationInterval !== "string"
  ) {
    return {
      error: "Invalid values",
      success: false,
    };
  }

  await prismadb.savedSearch.create({
    data: {
      name,
      img: "/assets/saved-search-map-polygon2.png",
      searchParams,
      isNotificationOn: isNotificationOn === "on",
      notificationInterval: notificationInterval,
      userId: user.id,
    },
  });

  return {
    success: true,
  };
}

export async function deleteSavedSearch(id: string) {
  const { user } = await validateRequest();
  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  await prismadb.savedSearch.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
  };
}

export async function updateSavedSearch(
  id: string,
  field: "isNotificationOn" | "notificationInterval",
  value: boolean | string
) {
  const { user } = await validateRequest();
  if (!user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }
  if (field === "isNotificationOn") {
    if (typeof value !== "boolean") {
      return {
        success: false,
        error: "Invalid value",
      };
    }
    await prismadb.savedSearch.update({
      where: {
        id,
      },
      data: {
        isNotificationOn: value,
      },
    });
    return {
      success: true,
    };
  }
  if (field === "notificationInterval") {
    if (typeof value !== "string") {
      return {
        success: false,
        error: "Invalid value",
      };
    }
    await prismadb.savedSearch.update({
      where: {
        id,
      },
      data: {
        notificationInterval: value,
      },
    });
    return {
      success: true,
    };
  }
  return {
    success: false,
  };
}
