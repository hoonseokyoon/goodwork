import Link from "next/link";

import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { href: "/map", label: "찾기" },
  { href: "/news", label: "뉴스" },
  { href: "/contribute", label: "기여" },
];

export default function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto space-y-6 px-4 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold">수도원·수녀원 허브</p>
            <p className="text-sm text-muted-foreground">
              전국의 수도원·수녀원 정보를 한눈에 모아 연결합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-4"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 수도원·수녀원 허브</p>
          <p>
            문의: {" "}
            <a
              href="mailto:contact@monastic-hub.kr"
              className="underline-offset-4 hover:underline"
            >
              contact@monastic-hub.kr
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
