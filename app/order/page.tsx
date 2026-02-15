"use client";

import { Button } from "@/components/ui/button";
import {
    CheckCircleIcon,
    ArrowLeftIcon,
    CreditCardIcon,
    MessageCircleIcon,
    CopyIcon,
    CheckIcon
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import * as fbq from "@/components/FBAds";

const BANKS = [
    {
        name: "Bank Central Asia (BCA)",
        account: "8610509879",
        holder: "Joko Susilo",
        color: "bg-blue-600",
    },
    {
        name: "Bank Mandiri",
        account: "1370004531675",
        holder: "Joko Susilo",
        color: "bg-yellow-500",
    },
    {
        name: "Bank Rakyat Indonesia (BRI)",
        account: "105601000146565",
        holder: "Joko Susilo",
        color: "bg-blue-800",
    }
];

export default function OrderPage() {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    const trackLead = async () => {
        const eventId = "lead_" + Date.now();

        // Browser Pixel
        fbq.event("Lead", {
            content_name: "GuruKit Lifetime Access",
            value: 99000,
            currency: "IDR"
        });

        // Server CAPI
        try {
            await fetch("/api/track-fb", {
                method: "POST",
                body: JSON.stringify({
                    eventName: "Lead",
                    eventId: eventId,
                    eventSourceUrl: window.location.href,
                    customData: {
                        content_name: "GuruKit Lifetime Access",
                        value: 99000,
                        currency: "IDR"
                    }
                }),
            });
        } catch (e) {
            console.error("CAPI Error:", e);
        }
    };

    const whatsappUrl = "https://wa.me/6282134341331?text=" + encodeURIComponent(
        "Halo Admin GuruKit, saya mau konfirmasi pembayaran aksess seumur hidup.\n\n" +
        "Detail Konfirmasi:\n" +
        "- Produk: GuruKit Lifetime Access\n" +
        "- Harga: Rp 99.000\n\n" +
        "Mohon bantuannya untuk aktivasi akun saya dengan email: [Masukan Email Anda di sini]"
    );

    return (
        <div className="min-h-screen bg-warm-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center text-warm-600 hover:text-coral-500 transition">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Kembali ke Beranda
                    </Link>
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-coral-500">Guru</span>
                        <span className="text-2xl font-bold text-warm-900">Kit</span>
                    </div>
                </div>

                {/* Order Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-warm-200/50 overflow-hidden border border-warm-100">
                    <div className="bg-coral-500 p-8 text-white">
                        <h1 className="text-2xl font-bold mb-2">Checkout: Akses Seumur Hidup</h1>
                        <p className="opacity-90">Satu langkah lagi untuk bebas dari urusan administrasi yang melelahkan.</p>
                    </div>

                    <div className="p-8">
                        {/* Price Summary */}
                        <div className="flex items-center justify-between p-4 bg-warm-50 rounded-2xl mb-8 border border-warm-100">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center text-coral-600 mr-4">
                                    <CreditCardIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-warm-900">Total Pembayaran</h3>
                                    <p className="text-sm text-warm-500 italic">Sekali bayar, pakai selamanya</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-coral-600">Rp 99.000</div>
                            </div>
                        </div>

                        {/* Bank Details */}
                        <h3 className="font-bold text-warm-900 mb-4 flex items-center">
                            <CreditCardIcon className="w-5 h-5 mr-2 text-warm-400" />
                            Transfer ke salah satu rekening di bawah:
                        </h3>

                        <div className="space-y-4 mb-8">
                            {BANKS.map((bank) => (
                                <div key={bank.name} className="p-5 border border-warm-100 rounded-2xl bg-warm-50/50 group hover:border-coral-200 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider rounded-full ${bank.color}`}>
                                            {bank.name}
                                        </span>
                                        <button
                                            onClick={() => handleCopy(bank.account)}
                                            className="text-warm-400 hover:text-coral-500 transition flex items-center text-sm"
                                        >
                                            {copied === bank.account ? (
                                                <><CheckIcon className="w-4 h-4 mr-1" /> Tersalin</>
                                            ) : (
                                                <><CopyIcon className="w-4 h-4 mr-1" /> Salin</>
                                            )}
                                        </button>
                                    </div>
                                    <div className="text-2xl font-bold tracking-wider text-warm-900 mb-1">{bank.account}</div>
                                    <div className="text-warm-500">a.n {bank.holder}</div>
                                </div>
                            ))}
                        </div>

                        {/* Steps */}
                        <div className="space-y-4 mb-8">
                            <h4 className="font-bold text-warm-900">Cara Aktivasi:</h4>
                            <div className="flex items-start">
                                <div className="w-6 h-6 bg-coral-100 rounded-full flex items-center justify-center text-coral-600 text-xs font-bold mr-3 mt-0.5 shrink-0">1</div>
                                <p className="text-warm-600 text-sm">Transfer tepat **Rp 99.000** ke salah satu rekening di atas.</p>
                            </div>
                            <div className="flex items-start">
                                <div className="w-6 h-6 bg-coral-100 rounded-full flex items-center justify-center text-coral-600 text-xs font-bold mr-3 mt-0.5 shrink-0">2</div>
                                <p className="text-warm-600 text-sm">Screenshot bukti transfer yang berhasil.</p>
                            </div>
                            <div className="flex items-start">
                                <div className="w-6 h-6 bg-coral-100 rounded-full flex items-center justify-center text-coral-600 text-xs font-bold mr-3 mt-0.5 shrink-0">3</div>
                                <p className="text-warm-600 text-sm">Klik tombol konfirmasi WA di bawah untuk mengirim bukti.</p>
                            </div>
                            <div className="flex items-start">
                                <div className="w-6 h-6 bg-coral-100 rounded-full flex items-center justify-center text-coral-600 text-xs font-bold mr-3 mt-0.5 shrink-0">4</div>
                                <p className="text-warm-600 text-sm">Admin akan memverifikasi dan mengaktifkan akun Anda dalam max 1x24 jam.</p>
                            </div>
                        </div>

                        {/* WA Button */}
                        <Button
                            asChild
                            className="w-full h-16 text-lg bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl shadow-lg border-none group"
                            onClick={trackLead}
                        >
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                <MessageCircleIcon className="w-6 h-6 mr-3 group-hover:scale-110 transition" />
                                Konfirmasi via WhatsApp Sekarang
                            </a>
                        </Button>

                        <p className="text-center text-sm text-warm-400 mt-6">
                            Butuh bantuan? Chat admin di nomor 0821-3434-1331
                        </p>
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="flex items-start p-4 bg-white/50 rounded-2xl border border-warm-100">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-warm-900 text-sm">Garansi 100% Aman</p>
                            <p className="text-xs text-warm-500 mt-1">Pembayaran diproses manual secara transparan.</p>
                        </div>
                    </div>
                    <div className="flex items-start p-4 bg-white/50 rounded-2xl border border-warm-100">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-warm-900 text-sm">Bantu Guru Indonesia</p>
                            <p className="text-xs text-warm-500 mt-1">Dukungan teknis siap membantu Anda kapan saja.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
