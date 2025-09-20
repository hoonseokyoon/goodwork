import Link from "next/link";
import { notFound } from "next/navigation";

import InstitutionHero from "@/components/institution-hero";
import NaverMap from "@/components/naver-map";
import ProductCard from "@/components/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { sb } from "@/lib/supabase-server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const paramsResult = await params;
  const slug = paramsResult?.slug;

  const fallbackMetadata = {
    title: "기관 — 수도원·수녀원",
  };

  if (!slug) {
    return fallbackMetadata;
  }

  const client = sb();
  const { data } = await client
    .from("institutions")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!data) {
    return fallbackMetadata;
  }


  return {
    title: `${data.name} — 수도원·수녀원`,
    description: data.description ?? undefined,
  };
}

type InstitutionDetail = {
  id: string | number;
  name: string;
  slug: string;
  type?: string | null;
  description?: string | null;
  address?: string | null;
  tags?: string[] | null;
  lat?: number | null;
  lng?: number | null;
  donation?: { account?: string | null; page_url?: string | null } | null;
  phone?: string | null;
  email?: string | null;
  website_url?: string | null;
};

type ProductRow = {
  id: string | number;
  name: string;
  image_url?: string | null;
  price?: number | string | null;
  category?: string | null;
  unit?: string | null;
  buy_url?: string | null;
  description?: string | null;
};

type EventRow = {
  id: string | number;
  title: string;
  start_at?: string | null;
  signup_url?: string | null;
};

export default async function InstitutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const paramsResult = await params;
  const slug = paramsResult?.slug;

  if (!slug) {
    notFound();
  }

  const client = sb();
  const { data: institution, error } = await client
    .from("institutions")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !institution) {
    notFound();
  }

  const donation = (institution.donation ?? {}) as {
    account?: string | null;
    page_url?: string | null;
  };

  const [{ data: products }, { data: events }] = await Promise.all([
    client
      .from("products")
      .select("*")
      .eq("institution_id", institution.id)
      .limit(12),
    client
      .from("events")
      .select("*")
      .eq("institution_id", institution.id)
      .order("start_at", { ascending: true }),
  ]);

  const typedInstitution = institution as InstitutionDetail;
  const typedProducts = (products ?? []) as ProductRow[];
  const typedEvents = (events ?? []) as EventRow[];

  return (
    <div className="space-y-6">
      <nav aria-label="브레드크럼" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/"
              className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-4"
            >
              홈
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/map"
              className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-4"
            >
              찾기
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-foreground">{typedInstitution.name}</li>
        </ol>
      </nav>

      <InstitutionHero
        name={typedInstitution.name}
        type={typedInstitution.type}
        description={typedInstitution.description ?? undefined}
        address={typedInstitution.address ?? undefined}
        tags={typedInstitution.tags ?? undefined}
      />

      <Card>
        <CardHeader>
          <CardTitle>위치</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {typedInstitution.lat && typedInstitution.lng ? (
            <div className="overflow-hidden rounded-2xl border">
              <NaverMap
                center={{
                  lat: typedInstitution.lat,
                  lng: typedInstitution.lng,
                }}
                markers={[
                  {
                    lat: typedInstitution.lat,
                    lng: typedInstitution.lng,
                    title: typedInstitution.name,
                    slug: typedInstitution.slug,
                  },
                ]}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              주소 또는 좌표 정보가 없습니다.
            </p>
          )}
          {typedInstitution.address ? (
            <p className="text-sm text-muted-foreground">
              {typedInstitution.address}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>후원</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {donation.account ? (
              <p>
                계좌: <span className="font-semibold">{donation.account}</span>
              </p>
            ) : (
              <p className="text-muted-foreground">등록된 후원 계좌가 없습니다.</p>
            )}
            {donation.page_url ? (
              <a
                href={donation.page_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
                aria-label={`${typedInstitution.name} 후원 페이지 (새 창)`}
              >
                후원 페이지 바로가기
              </a>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>연락처</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {typedInstitution.phone ? <p>전화: {typedInstitution.phone}</p> : null}
            {typedInstitution.email ? (
              <p>
                이메일: {" "}
                <a
                  href={`mailto:${typedInstitution.email}`}
                  className="underline-offset-4 hover:underline"
                >
                  {typedInstitution.email}
                </a>
              </p>
            ) : null}
            {typedInstitution.website_url ? (
              <a
                href={typedInstitution.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
                aria-label={`${typedInstitution.name} 공식 홈페이지 (새 창)`}
              >
                공식 홈페이지 바로가기
              </a>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {typedProducts.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">제품</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {typedProducts.map((product) => (
              <ProductCard key={product.id} item={product} />
            ))}
          </div>
        </section>
      ) : null}

      {typedEvents.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">행사</h2>
          <ul className="space-y-2 text-sm">
            {typedEvents.map((event) => (
              <li
                key={event.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-muted-foreground">
                    {formatDateTime(event.start_at)}
                  </p>
                </div>
                {event.signup_url ? (
                  <a
                    href={event.signup_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                    aria-label={`${event.title} 신청 페이지 (새 창)`}
                  >
                    신청하기
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
