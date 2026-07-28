import { initAuth } from "@/auth";

async function handler(request: Request) {
    const auth = await initAuth();
    return auth.handler(request);
}

export { handler as GET, handler as POST };
