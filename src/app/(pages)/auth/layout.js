import { Toaster } from "@/components/ui/sonner";

export default function AuthLayout({ children }) {
  return (
    <div className="bg-gray-200 animated-bg text-black mx-6 rounded-b-4xl">
      {children}
      <Toaster position="top-center" richColors expand={false}/>
    </div>
  );
}
