import ContributionCard from "@/components/contribution-card";
import ProductCard from "@/components/product-card";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateTime } from "@/lib/utils";
import { sb } from "@/lib/supabase-server";

export const metadata = {
  title: "기여 — 후원/구매/참여",
};

export const revalidate = 1800;

type InstitutionRow = {
  id: string | number;
  name: string;
  slug: string;
  donation?: { account?: string | null; page_url?: string | null } | null;
  summary?: string | null;
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

export default async function ContributePage() {
  const client = sb();

  const [institutionsResponse, productsResponse, eventsResponse] = await Promise.all([
    client.from("institutions").select("id, name, slug, donation, summary").limit(50),
    client.from("products").select("*").limit(24),
    client
      .from("events")
      .select("*")
      .order("start_at", { ascending: true })
      .limit(24),
  ]);

  if (institutionsResponse.error) {
    console.error("Failed to load institutions", institutionsResponse.error);
  }
  if (productsResponse.error) {
    console.error("Failed to load products", productsResponse.error);
  }
  if (eventsResponse.error) {
    console.error("Failed to load events", eventsResponse.error);
  }

  const institutions = (institutionsResponse.data ?? []) as InstitutionRow[];
  const products = (productsResponse.data ?? []) as ProductRow[];
  const events = (eventsResponse.data ?? []) as EventRow[];

  return (
    <Tabs defaultValue="donate" className="space-y-6">
      <TabsList className="gap-2">
        <TabsTrigger value="donate">후원</TabsTrigger>
        <TabsTrigger value="buy">구매</TabsTrigger>
        <TabsTrigger value="volunteer">참여</TabsTrigger>
      </TabsList>

      <TabsContent value="donate" className="space-y-4">
        {institutions.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {institutions.map((institution) => (
              <ContributionCard key={institution.id} institution={institution} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              등록된 후원 정보가 없습니다. 새로운 후원 소식이 준비되는 대로 안내해
              드릴게요.
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="buy" className="space-y-4">
        {products.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} item={product} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              아직 소개할 제품이 없습니다. 상품 등록 후 이곳에서 만나보세요.
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="volunteer" className="space-y-4">
        {events.length ? (
          <ul className="space-y-2 text-sm">
            {events.map((event) => (
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
        ) : (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              예정된 봉사나 행사 소식이 없습니다. 새로운 참여 소식이 열리면 빠르게
              업데이트하겠습니다.
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
