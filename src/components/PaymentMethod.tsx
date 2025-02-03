import { useState } from "react";
import { useTranslations } from "next-intl";

interface PaymentMethodProps {
  amount: number;
}

export default function PaymentMethod({ amount }: PaymentMethodProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "other" | "free">(
    "other",
  );
  const t = useTranslations("creditCard");

  return (
    <section className="px-2">
      <div className="mb-6">
        <h5 className="text mb-2 font-semibold">{t("title")}</h5>
        <p className="mb-6 text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      <div className="space-y-4">
        {/* Free  Option */}
        <div className="rounded-lg border p-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="free"
              checked={paymentMethod === "free"}
              onChange={(e) => setPaymentMethod("free")}
              className="h-4 w-4"
            />
            <div>
              <h5 className="font-medium">{t("free")}</h5>
              <p className="text-sm text-gray-600">{t("freeDescription")}</p>
            </div>
          </label>
        </div>

        {/* Credit Card Option */}
        <div className="pointer-events-none cursor-not-allowed rounded-lg border p-4 opacity-50">
          <label className="flex cursor-pointer items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod("card")}
                className="h-4 w-4"
              />
              <div>
                <h5 className="font-medium">{t("debitCreditCard")}</h5>
                <p className="text-sm text-gray-600">{amount}€</p>
              </div>
            </div>
            <div className="flex gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png"
                alt="Visa"
                width={35}
                height={24}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/2560px-Mastercard-logo.svg.png"
                alt="Mastercard"
                width={35}
                height={24}
              />
            </div>
          </label>

          {paymentMethod === "card" && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("firstName")}
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border p-2"
                    name="firstName"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("lastName")}
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border p-2"
                    name="lastName"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t("cardNumber")}
                </label>
                <input
                  type="text"
                  className="w-full rounded border p-2"
                  name="cardNumber"
                  maxLength={16}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("expiryDate")}
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border p-2"
                    placeholder={t("expiryDatePlaceholder")}
                    name="expiryDate"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("cvv")}
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border p-2"
                    name="cvv"
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>{t("securityMessage")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Other Payment Option */}
        <div className="pointer-events-none cursor-not-allowed rounded-lg border p-4 opacity-50">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="other"
              checked={paymentMethod === "other"}
              onChange={(e) => setPaymentMethod("other")}
              className="h-4 w-4"
            />
            <div>
              <h5 className="font-medium">{t("otherPayment")}</h5>
              <p className="text-sm text-gray-600">
                {t("otherPaymentDescription")}
              </p>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}
