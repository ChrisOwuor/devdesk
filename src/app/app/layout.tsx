// app/app/layout.tsx
import PrimarySidebar from "@/components/ui/PrimarySidebar";
import { NavProvider } from "@/providers/NavProvider";
import { auth } from "../../../lib/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <aside className="p-2">
        <PrimarySidebar />
      </aside>

      <main className="w-full min-h-screen ">{children}</main>
    </div>
  );
}
