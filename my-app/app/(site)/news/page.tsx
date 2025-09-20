import NewsCard from "@/components/news-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sb } from "@/lib/supabase-server";

export const metadata = {
  title: "뉴스 — 활동 소식",
};

export const revalidate = 1800;

type NewsRow = {
  id: string | number;
  title: string;
  source_url?: string | null;
  source_name?: string | null;
  image_url?: string | null;
  published_at?: string | null;
  tags?: string[] | null;
};

export default async function NewsPage() {
  const client = sb();
  const { data, error } = await client
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(24);

  if (error) {
    console.error("Failed to load news", error);
  }

  const items = (data ?? []) as NewsRow[];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-base">최근 소식</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          수도원·수녀원의 활동, 봉사 후기, 제품 출시 등을 카드 뉴스로 전달합니다.
        </CardContent>
      </Card>
      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            아직 등록된 소식이 없습니다. 업데이트가 준비되면 이곳에서 확인하실 수
            있습니다.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
