import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DonationInfo = {
  account?: string | null;
  page_url?: string | null;
};

type ContributionCardProps = {
  institution: {
    id: string | number;
    name: string;
    slug: string;
    donation?: DonationInfo | null;
    summary?: string | null;
  };
};

export default function ContributionCard({ institution }: ContributionCardProps) {
  const donation = institution.donation ?? {};

  return (
    <Card className="h-full transition hover:shadow-md">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-base">{institution.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {institution.summary ? (
          <p className="text-muted-foreground">{institution.summary}</p>
        ) : null}
        {donation.account ? (
          <p>
            계좌: <span className="font-semibold">{donation.account}</span>
          </p>
        ) : null}
        {donation.page_url ? (
          <a
            href={donation.page_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:underline"
            aria-label={`${institution.name} 후원 페이지 (새 창)`}
          >
            후원 페이지 바로가기
          </a>
        ) : null}
        <div>
          <Button asChild size="sm" variant="secondary">
            <Link href={`/institutions/${institution.slug}`}>
              기관 페이지
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
