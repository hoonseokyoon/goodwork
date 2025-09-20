import InstitutionListItem from "@/components/institution-list-item";
import NaverMap from "@/components/naver-map";
import SearchFilters from "@/components/filters/search-filters";
import { Card, CardContent } from "@/components/ui/card";
import { sb } from "@/lib/supabase-server";

export const revalidate = 3600;
export const metadata = {
  title: "찾기 — 수도원·수녀원",
};

type MapPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type InstitutionRow = {
  id: string | number;
  name: string;
  slug: string;
  lat: number | null;
  lng: number | null;
  type?: string | null;
  address?: string | null;
  tags?: string[] | null;
};

export default async function MapPage({ searchParams }: MapPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};

  const supabase = sb();
  const queryParamRaw =
    typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q.trim() : "";
  const queryParam = queryParamRaw
    .replace(/['"]/g, "")
    .replace(/[%_,]/g, (char) => (char === "," ? " " : `\\${char}`));
  const typeParam =
    typeof resolvedSearchParams.type === "string" ? resolvedSearchParams.type : "";

  let query = supabase
    .from("institutions")
    .select("id, name, slug, lat, lng, type, address, tags")
    .order("name", { ascending: true });

  if (queryParam) {
    query = query.or(
      `name.ilike.%${queryParam}%,address.ilike.%${queryParam}%`,
    );
  }

  if (typeParam) {
    query = query.eq("type", typeParam);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch institutions", error);
  }

  const institutions: InstitutionRow[] = data ?? [];

  const markers = institutions
    .filter(
      (institution) =>
        typeof institution.lat === "number" &&
        typeof institution.lng === "number",
    )
    .map((institution) => ({
      lat: institution.lat as number,
      lng: institution.lng as number,
      title: institution.name,
      slug: institution.slug,
    }));

  const mapCenter = markers.length
    ? { lat: markers[0].lat, lng: markers[0].lng }
    : { lat: 37.5665, lng: 126.978 };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-8">
        <SearchFilters />
        <div className="overflow-hidden rounded-2xl border shadow-sm">
          <NaverMap center={mapCenter} markers={markers} />
        </div>
      </div>
      <aside className="space-y-3 lg:col-span-4">
        {institutions.length ? (
          institutions.map((institution) => (
            <InstitutionListItem key={institution.id} item={institution} />
          ))
        ) : (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              검색 조건에 해당하는 기관이 없습니다. 다른 키워드나 필터를 선택해
              보세요.
            </CardContent>
          </Card>
        )}
      </aside>
    </div>
  );
}
