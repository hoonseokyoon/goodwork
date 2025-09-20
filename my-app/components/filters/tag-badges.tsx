import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TagBadgesProps = {
  tags?: string[] | null;
  className?: string;
};

export default function TagBadges({ tags, className }: TagBadgesProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
