import ClientNavbar from "../../../components/ClientNavBar";
import "../(pages)/globals.css";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="overflow-hidden bg-primary">
        <ClientNavbar />
        <main className="bg-gray-200 animated-bg text-black mx-6 rounded-b-4xl">{children}</main>
        <Toaster position="top-center" richColors expand={false}/>
      </body>
    </html>
  );
}
