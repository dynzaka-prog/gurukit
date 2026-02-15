import crypto from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

export async function trackCAPI({
    eventName,
    eventSourceUrl,
    userData = {},
    customData = {},
    eventId,
}: {
    eventName: string;
    eventSourceUrl: string;
    userData?: any;
    customData?: any;
    eventId: string;
}) {
    if (!PIXEL_ID || !ACCESS_TOKEN) {
        console.warn("FB_PIXEL_ID or FB_ACCESS_TOKEN missing, skipping CAPI tracking");
        return;
    }

    try {
        const data = {
            data: [
                {
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: "website",
                    event_source_url: eventSourceUrl,
                    event_id: eventId,
                    user_data: {
                        client_ip_address: userData.ip,
                        client_user_agent: userData.userAgent,
                        fbc: userData.fbc,
                        fbp: userData.fbp,
                        ...userData,
                    },
                    custom_data: {
                        currency: "IDR",
                        value: 99000,
                        ...customData,
                    },
                },
            ],
        };

        const response = await fetch(
            `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error tracking CAPI:", error);
    }
}

export function hashData(data: string) {
    if (!data) return undefined;
    return crypto.createHash("sha256").update(data.trim().toLowerCase()).digest("hex");
}
