"use client";

import { useEffect } from "react";
import * as fbq from "@/components/FBAds";
import { createClient } from "@/utils/supabase/client";

export function PurchaseTracker({ userId }: { userId: string }) {
    useEffect(() => {
        const trackPurchase = async () => {
            const eventId = "pur_" + userId + "_" + Date.now();
            const supabase = createClient();

            console.log("🚀 Firing FB Purchase event for user:", userId);

            // 1. Browser Pixel
            fbq.event("Purchase", {
                value: 99000,
                currency: "IDR",
                content_name: "GuruKit Lifetime Access",
            });

            // 2. Server CAPI Tracking
            try {
                await fetch("/api/track-fb", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        eventName: "Purchase",
                        eventId: eventId,
                        eventSourceUrl: window.location.href,
                        customData: {
                            value: 99000,
                            currency: "IDR",
                            content_name: "GuruKit Lifetime Access",
                        },
                    }),
                });
            } catch (e) {
                console.error("CAPI Purchase Tracking Error:", e);
            }

            // 3. Mark as tracked in DB so it doesn't fire again
            const { error } = await supabase
                .from("profiles")
                .update({ purchase_tracked: true })
                .eq("id", userId);

            if (error) {
                console.error("Error updating purchase_tracked status:", error);
            } else {
                console.log("✅ Purchase successfully tracked and recorded for user:", userId);
            }
        };

        trackPurchase();
    }, [userId]);

    return null;
}
