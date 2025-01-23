"use server";

import { ActionResult } from "@/components/Form";
import prismadb from "@/lib/db";
import { getCurrentSession, getCurrentUser } from "@/lib/sessions";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

export async function getMySavedSearches() {
  const { user } = await getCurrentUser();
  const locale = await getLocale();
  if (!user) {
    redirect({
      href: "/",
      locale: locale,
    });

    return;
  }

  const savedSearches = await prismadb.savedSearch.findMany({
    where: {
      userId: user.id,
    },
  });

  return savedSearches;
}

export const createSavedSearch = async (
  state: ActionResult,
  formData: FormData,
): Promise<ActionResult> => {
  console.log("ss", formData);

  const { user } = await getCurrentUser();
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
    typeof isNotificationOn !== "string"
    // typeof notificationInterval !== "string"
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
      notificationInterval: (notificationInterval as string) || "weekly",
      userId: user.id,
    },
  });

  return {
    error: null,
    success: true,
  };
};

export async function deleteSavedSearch(id: number) {
  const { user } = await getCurrentUser();
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
  id: number,
  field: "isNotificationOn" | "notificationInterval" | "lastOpenedAt",
  value: any,
) {
  console.log("updateSavedSearch", id, field, value);
  const { account } = await getCurrentSession();
  if (!account) {
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
  if (field === "lastOpenedAt") {
    console.log("lastOpenedAt", value, typeof value);
    if (typeof value !== "object") {
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
        lastOpenedAt: new Date(),
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
