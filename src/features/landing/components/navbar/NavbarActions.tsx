import Link from "next/link";

import { useTranslations } from "next-intl";


import LanguageSwitcher from "./LanguageSwitcher";
import BookingButton from "../BookingButton";

export default function NavbarActions() {

  const t = useTranslations("Navbar");

  return (
    <div className="hidden items-center gap-4 lg:flex">

      <LanguageSwitcher />

      <BookingButton className="px-8 h-10 text-sm" />

    </div>
  );
}