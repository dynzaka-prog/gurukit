import { getProfile } from "@/lib/db/profiles";
import { redirect } from "next/navigation";

export default async function GenerateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const profile = await getProfile();

    if (!profile?.is_premium) {
        return redirect("/order");
    }

    return <>{children}</>;
}
