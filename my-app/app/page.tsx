import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-indigo-100 via-white to-emerald-100 px-6 py-12 shadow-sm">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <Badge variant="secondary" className="bg-white/80 px-3 py-1 text-xs font-medium">
            Monastic Community Hub
          </Badge>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              전국의 수도원·수녀원 소식을 한곳에서 발견하고 연결하세요
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              지도에서 기관을 찾고, 최신 활동을 확인하며, 후원과 봉사로 함께할 수 있는 공간입니다.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/map">지도에서 찾기</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contribute">참여 안내 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">허브에서 할 수 있는 것</h2>
          <p className="text-sm text-muted-foreground">
            수도회별 필터와 위치 정보, 소식 카드, 후원과 참여 정보까지 필요한 내용을 바로 만나보세요.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="transition hover:shadow-md">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-lg">지도에서 한눈에 탐색</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                수도회 유형과 지역으로 필터링하며 수도원·수녀원의 위치와 기본 정보를 살펴볼 수 있습니다.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href="/map">찾기 페이지 이동</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="transition hover:shadow-md">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-lg">뉴스와 활동 모아보기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                각 수도회의 소식, 봉사 후기, 행사 소식을 카드 형태로 정리해 빠르게 훑어볼 수 있습니다.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href="/news">뉴스 페이지 이동</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="transition hover:shadow-md">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-lg">후원·구매·봉사로 동참</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                정기 후원 계좌, 수도원 제품 구매처, 봉사/피정 신청 정보를 확인하고 바로 참여할 수 있습니다.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href="/contribute">기여 페이지 이동</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">운영 원칙</h2>
          <p className="text-sm text-muted-foreground">
            수도자와 방문자 모두에게 도움이 되는 정보 아카이브를 지향합니다.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="transition hover:shadow-md">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base">정확한 정보 업데이트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Supabase와 연동된 데이터로 기관 소개, 연락처, 행사 정보를 주기적으로 검토하고 갱신합니다.
              </p>
              <Separator className="bg-border/70" />
              <p>정보 수정이나 제보는 언제든지 이메일로 알려주세요.</p>
            </CardContent>
          </Card>
          <Card className="transition hover:shadow-md">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-base">함께 만드는 공동체 지도</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                봉헌 생활을 소개하고 싶은 수도원·수녀원, 참여하고 싶은 방문자를 연결하는 열린 플랫폼을 지향합니다.
              </p>
              <Separator className="bg-border/70" />
              <p>
                운영팀과 협력해 자료를 정리하고 카드 뉴스 형태로 누구나 쉽게 공유할 수 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
