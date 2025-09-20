import "server-only";

import { createClient } from "@supabase/supabase-js";

const { supabaseUrl, supabaseAnonKey } = (() => {
  const url =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

  if (!url) {
    throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
  }

  if (!anonKey) {
    throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
  }

  return { supabaseUrl: url, supabaseAnonKey: anonKey };
})();

export function sb() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}
