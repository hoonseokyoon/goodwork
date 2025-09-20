"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const typeOptions = [
  { value: "", label: "전체" },
  { value: "benedictine", label: "베네딕도회" },
  { value: "carmelite", label: "카르멜회" },
  { value: "franciscan", label: "프란치스코회" },
];

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(() => searchParams.get("q") ?? "");

  useEffect(() => {
    setKeyword(searchParams.get("q") ?? "");
  }, [searchParams]);

  const typeValue = searchParams.get("type") ?? "";

  const createUrl = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const query = params.toString();
      return query ? `/map?${query}` : "/map";
    },
    [searchParams],
  );

  const handleSubmit = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      router.push(createUrl({ q: trimmed || undefined }));
    },
    [router, createUrl],
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="w-full max-w-xs sm:max-w-sm">
        <span className="sr-only">이름 또는 주소로 검색</span>
        <Input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSubmit(event.currentTarget.value);
            }
          }}
          placeholder="이름/주소로 검색"
        />
      </label>
      <Select
        value={typeValue}
        onValueChange={(value) => {
          router.push(createUrl({ type: value || undefined }));
        }}
      >
        <SelectTrigger className="w-48 sm:w-56" aria-label="수도회 선택">
          <SelectValue placeholder="수도회" />
        </SelectTrigger>
        <SelectContent>
          {typeOptions.map((option) => (
            <SelectItem key={option.value || "all"} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
