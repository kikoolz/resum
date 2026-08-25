import { initAuth } from "@/auth";

async function handler(request: Request) {
    try {
        const auth = await initAuth();
        const response = await auth.handler(request);
        return response;
    } catch (error: any) {
        console.error("[AUTH ERROR]", request.url, error?.message, error?.stack);
        return new Response(JSON.stringify({ error: error?.message || "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export { handler as GET, handler as POST };
