import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import prismadb from "@/lib/db";
import AdminListingsTable from "./_components/AdminListingsTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function AdminListingsPage() {
  const { user } = await validateRequest();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const listings = await prismadb.listing.findMany({
    include: {
      owner: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Property Listings</h1>
        <div className="flex gap-4">
          <Input placeholder="Search listings..." className="w-[300px]" />
          <Button>Export CSV</Button>
        </div>
      </div>
      <AdminListingsTable listings={listings} />
    </div>
  );
}
