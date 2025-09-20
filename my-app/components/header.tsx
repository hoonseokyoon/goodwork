"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

const navigation = [
  { href: "/map", label: "찾기" },
  { href: "/news", label: "뉴스" },
  { href: "/contribute", label: "기여" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link
          href="/"
          className="font-semibold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-4"
        >
          수도원·수녀원 허브
        </Link>
        <nav aria-label="주요 메뉴" className="flex gap-2">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname?.startsWith(`${item.href}/`) ||
              (item.href === "/map" && pathname?.startsWith("/institutions"));
            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "default" : "ghost"}
                size="sm"
              >
                <Link
                  href={item.href}
                  className="focus-visible:outline-none"
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
