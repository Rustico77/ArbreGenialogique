import "./globals.css";
import Navbar from "../../../components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import ClientNavbar from "../../../components/ClientNavBar";

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <body className="bg-primary">
        <ClientNavbar />
        <main className="bg-gray-200 animated-bg text-black mx-6 rounded-b-4xl">{children}</main>
        <Toaster position="top-center" richColors expand={false}/>
      </body>
    </html>
  );
}
