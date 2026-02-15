import { NextRequest, NextResponse } from "next/server";
import { trackCAPI } from "@/lib/utils/fb-tracking";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { eventName, eventId, userData, customData, eventSourceUrl } = body;

        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const userAgent = req.headers.get("user-agent") || "";

        const result = await trackCAPI({
            eventName,
            eventId,
            eventSourceUrl: eventSourceUrl || req.nextUrl.href,
            userData: {
                ip,
                userAgent,
                ...userData,
            },
            customData,
        });

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error("Error in track-fb route:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
