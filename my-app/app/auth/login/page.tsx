import { redirect } from "next/navigation";

export default function Page() {
  // 로그인 기능이 비활성화되었으므로 메인 페이지로 리다이렉트
  redirect("/");
}
