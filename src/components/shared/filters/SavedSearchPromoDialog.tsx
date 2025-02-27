"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Modal } from "../Modal";
import { useTranslations } from "next-intl";

interface SavedSearchPromoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export default function SavedSearchPromoDialog({
  isOpen,
  onClose,
  onConfirm,
}: SavedSearchPromoDialogProps) {
  const t = useTranslations("");
  return (
    <>
      <Modal
        isOpen={isOpen}
        title={t("savedSearches.promoDialog.dialogTitle")}
        onClose={onClose}
        confirmLabel={t("savedSearches.promoDialog.confirmLabel")}
        onConfirm={onConfirm}
      >
        <div className="space-y-4 px-4 text-center">
          <h4 className="text-xl font-medium">
            {t("savedSearches.promoDialog.title")}
          </h4>
          <p className="text-gray-600">
            {t("savedSearches.promoDialog.description")}
          </p>
          <ul className="list-disc pl-6 text-left text-gray-600">
            <li>{t("savedSearches.promoDialog.feature1")}</li>
            <li>{t("savedSearches.promoDialog.feature2")}</li>
            <li>{t("savedSearches.promoDialog.feature3")}</li>
          </ul>
        </div>
      </Modal>
    </>
  );
}
