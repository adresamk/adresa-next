"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  propertyType: z.string(),
  listingType: z.string(),
  size: z.string(),
  rooms: z.string(),
  floor: z.string().optional(),
  constructionYear: z.string(),
  heatingType: z.string(),
});

export default function NewListingForm() {
  const t = useTranslations();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: "",
      listingType: "",
      size: "",
      rooms: "",
      floor: "",
      constructionYear: "",
      heatingType: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border border-slate-200 p-6">
          <h2 className="mb-6 text-xl font-semibold text-brand-dark-blue">
            {t("listing.new.propertyDetails")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("listing.new.propertyType.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="apartment">
                        {t("listing.new.propertyType.apartment")}
                      </SelectItem>
                      <SelectItem value="house">
                        {t("listing.new.propertyType.house")}
                      </SelectItem>
                      <SelectItem value="office">
                        {t("listing.new.propertyType.office")}
                      </SelectItem>
                      <SelectItem value="land">
                        {t("listing.new.propertyType.land")}
                      </SelectItem>
                      <SelectItem value="store">
                        {t("listing.new.propertyType.store")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="listingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("listing.new.listingType.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sale">
                        {t("listing.new.listingType.sale")}
                      </SelectItem>
                      <SelectItem value="rent">
                        {t("listing.new.listingType.rent")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("listing.new.size.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("listing.new.size.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("listing.new.rooms.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("listing.new.rooms.placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, "5+"].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("listing.new.floor.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("listing.new.floor.placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="constructionYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("listing.new.construction.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("listing.new.construction.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heatingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("listing.new.heating.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="central">
                        {t("listing.new.heating.central")}
                      </SelectItem>
                      <SelectItem value="electric">
                        {t("listing.new.heating.electric")}
                      </SelectItem>
                      <SelectItem value="gas">
                        {t("listing.new.heating.gas")}
                      </SelectItem>
                      <SelectItem value="none">
                        {t("listing.new.heating.none")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          {t("listing.new.submit")}
        </Button>
      </form>
    </Form>
  );
}
