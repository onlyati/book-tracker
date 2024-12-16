import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header/Header";
import BodyWrapper from "./components/BodyWrapper";

export const metadata: Metadata = {
    title: "BookTracker",
    description: "Track your book library!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="bg-gray-300 dark:bg-gray-900 text-gray-950 dark:text-white">
                <Header title={process.env.APP_TITLE} />
                <BodyWrapper>
                    {children}
                </BodyWrapper>
            </body>
        </html>
    );
}
