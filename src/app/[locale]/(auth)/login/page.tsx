import { LoginForm } from "@/features/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden lg:flex min-h-screen flex-col items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="relative h-20 w-40 sm:h-24 sm:w-48 lg:h-80 lg:w-90 ">
          <Image
            src="/images/landing/logo2.png"
            alt="Savora Restaurant"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div className="relative  w-40 sm:h-24 sm:w-48  lg:w-90">
          <Image
            src="/images/landing/logo.png"
            alt="Savora Restaurant"
            fill
            priority
            className="object-contain"
          />
        </div>
      </section>
      <div className="flex items-center justify-center px-6 py-16">
        <LoginForm />
      </div>
    </div>
  );
}
