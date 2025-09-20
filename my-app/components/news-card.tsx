import Image from "next/image";

import TagBadges from "@/components/filters/tag-badges";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

type NewsItem = {
  id: string | number;
  title: string;
  source_url?: string | null;
  source_name?: string | null;
  image_url?: string | null;
  published_at?: string | null;
  tags?: string[] | null;
};

type NewsCardProps = {
  item: NewsItem;
};

export default function NewsCard({ item }: NewsCardProps) {
  const publishedAt = formatDate(item.published_at, { dateStyle: "medium" });

  const sourceLabel = item.source_name ?? (item.source_url ? "원문" : "");

  const card = (
    <Card className="h-full overflow-hidden transition hover:shadow-md">
      {item.image_url ? (
        <div className="relative h-40 w-full">
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            sizes="(min-width: 1280px) 250px, (min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <CardContent className="space-y-2 p-4">
        <p className="line-clamp-2 font-medium">{item.title}</p>
        {publishedAt ? (
          <p className="text-xs text-muted-foreground">{publishedAt}</p>
        ) : null}
        <TagBadges tags={item.tags} />
      </CardContent>
      {item.source_name || item.source_url ? (
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
          출처: {sourceLabel}
        </CardFooter>
      ) : null}
    </Card>
  );

  if (item.source_url) {
    return (
      <a
        href={item.source_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.title} 원문 기사 (새 창)`}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-4"
      >
        {card}
      </a>
    );
  }

  return <article>{card}</article>;
}
