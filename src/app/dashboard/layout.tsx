import { requireSession } from "@/lib/auth-server";
import { DashboardNavbar } from "@/components/dashboard-navbar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await requireSession();

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <DashboardNavbar user={session.user} />
            <main className="flex flex-1 flex-col">{children}</main>
        </div>
    );
}
