import { initAuth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
    const auth = await initAuth();
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session;
}

export async function requireSession() {
    const session = await getSession();
    if (!session) {
        redirect("/sign-in");
    }
    return session;
}
