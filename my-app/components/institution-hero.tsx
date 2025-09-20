import TagBadges from "@/components/filters/tag-badges";
import { Badge } from "@/components/ui/badge";

interface InstitutionHeroProps {
  name: string;
  type?: string | null;
  description?: string | null;
  address?: string | null;
  tags?: string[] | null;
}

export default function InstitutionHero({
  name,
  type,
  description,
  address,
  tags,
}: InstitutionHeroProps) {
  return (
    <section className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
        {type ? <Badge variant="secondary">{type}</Badge> : null}
      </div>
      {address ? <p className="text-sm text-muted-foreground">{address}</p> : null}
      <TagBadges tags={tags} />
      {description ? (
        <p className="text-muted-foreground whitespace-pre-line">{description}</p>
      ) : null}
    </section>
  );
}
