import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import prismadb from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Eye, DollarSign } from "lucide-react";

export default async function AdminDashboardPage() {
  const { user } = await validateRequest();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const [totalListings, totalUsers] = await Promise.all([
    prismadb.listing.count(),
    prismadb.user.count(),
  ]);

  const stats = [
    {
      name: "Total Listings",
      value: totalListings,
      icon: Building2,
    },
    {
      name: "Total Users",
      value: totalUsers,
      icon: Users,
    },
    {
      name: "Total Views",
      value: "1,234",
      icon: Eye,
    },
    {
      name: "Revenue",
      value: "$0",
      icon: DollarSign,
    },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add more dashboard widgets here */}
    </div>
  );
}
