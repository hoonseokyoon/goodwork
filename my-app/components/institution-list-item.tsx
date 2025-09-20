import Link from "next/link";

import TagBadges from "@/components/filters/tag-badges";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type InstitutionSummary = {
  slug: string;
  name: string;
  type?: string | null;
  address?: string | null;
  tags?: string[] | null;
};

type InstitutionListItemProps = {
  item: InstitutionSummary;
};

export default function InstitutionListItem({ item }: InstitutionListItemProps) {
  return (
    <Link
      href={`/institutions/${item.slug}`}
      className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-4"
    >
      <Card className="transition hover:shadow-md">
        <CardHeader className="space-y-2 pb-2 pt-4">
          <CardTitle className="flex items-center gap-2 text-base">
            {item.name}
            {item.type ? <Badge variant="secondary">{item.type}</Badge> : null}
          </CardTitle>
          {item.address ? (
            <p className="text-sm text-muted-foreground">{item.address}</p>
          ) : null}
        </CardHeader>
        {item.tags && item.tags.length > 0 ? (
          <CardContent className="pb-4 pt-0">
            <TagBadges tags={item.tags} />
          </CardContent>
        ) : null}
      </Card>
    </Link>
  );
}
