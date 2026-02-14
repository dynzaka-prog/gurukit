"use client";

import { useState } from "react";
import {
    MenuIcon,
    XIcon,
    BookOpenIcon,
    LayoutDashboardIcon,
    FileTextIcon,
    SettingsIcon,
    LogOutIcon
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
    profileName: string;
    onSignOut: () => Promise<void>;
}

export function DashboardHeader({ profileName, onSignOut }: DashboardHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="h-16 bg-white border-b border-warm-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-warm-600 hover:bg-warm-50 rounded-lg"
                    >
                        {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>

                    <h2 className="text-lg md:text-xl font-bold text-warm-900 line-clamp-1">
                        Halo, {profileName || 'Bapak/Ibu'}! 👋
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral-400 to-coral-500 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-white font-bold shrink-0">
                        {profileName?.[0] || 'G'}
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-warm-900/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
                    <nav className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                        <div className="p-6 border-b border-warm-100 flex items-center gap-2">
                            <BookOpenIcon className="w-8 h-8 text-coral-500" />
                            <span className="text-xl font-bold text-warm-900">GuruKit</span>
                        </div>

                        <div className="flex-1 p-4 space-y-2">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 p-3 bg-coral-50 text-coral-600 rounded-xl font-semibold"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <LayoutDashboardIcon className="w-5 h-5" />
                                Dashboard
                            </Link>
                            <Link
                                href="/generate/soal"
                                className="flex items-center gap-3 p-3 text-warm-600 hover:bg-warm-50 rounded-xl transition"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FileTextIcon className="w-5 h-5" />
                                Bikin Soal
                            </Link>
                            <Link
                                href="/generate/modul"
                                className="flex items-center gap-3 p-3 text-warm-600 hover:bg-warm-50 rounded-xl transition"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <BookOpenIcon className="w-5 h-5" />
                                Bikin Modul
                            </Link>
                        </div>

                        <div className="p-4 border-t border-warm-100 space-y-2">
                            <Button variant="ghost" className="w-full justify-start text-warm-500 px-3">
                                <SettingsIcon className="w-4 h-4 mr-2" />
                                Pengaturan
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-error hover:bg-error/5 px-3"
                                onClick={async () => {
                                    await onSignOut();
                                    setIsMenuOpen(false);
                                }}
                            >
                                <LogOutIcon className="w-4 h-4 mr-2" />
                                Keluar
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </>
    );
}
