import Image from "next/image";
import Link from "next/link";

import { navbarData } from "../../data";

interface NavbarLogoProps {
  href?: string;
}

export default function NavbarLogo({ href = "/" }: NavbarLogoProps) {
  return (
    <Link href={href}>
      <Image
        src={navbarData.logo}
        alt="Savora"
        width={170}
        height={45}
        priority
        className="h-auto w-42.5"
      />
    </Link>
  );
}
