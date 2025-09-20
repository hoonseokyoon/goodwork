import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type Product = {
  id: string | number;
  name: string;
  image_url?: string | null;
  price?: number | string | null;
  category?: string | null;
  unit?: string | null;
  buy_url?: string | null;
  description?: string | null;
};

type ProductCardProps = {
  item: Product;
};

export default function ProductCard({ item }: ProductCardProps) {
  const priceLabel = formatCurrency(item.price ?? undefined);
  const meta = [item.category, item.unit].filter(Boolean).join(" · ");

  return (
    <Card className="h-full overflow-hidden transition hover:shadow-md">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-base">{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {item.image_url ? (
          <div className="relative h-40 w-full overflow-hidden rounded-lg">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              sizes="(min-width: 1280px) 250px, (min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        {meta ? <p className="text-sm text-muted-foreground">{meta}</p> : null}
        {priceLabel ? (
          <p className="text-base font-semibold text-foreground">{priceLabel}</p>
        ) : null}
        {item.description ? (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        ) : null}
      </CardContent>
      {item.buy_url ? (
        <CardFooter className="pt-0">
          <Button asChild size="sm">
            <a
              href={item.buy_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.name} 구매 페이지 (새 창)`}
            >
              구매하기
            </a>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
