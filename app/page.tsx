"use client";

import Result from "@/component/Result";
import Select from "@/component/Select";
import { useSearchParams } from "next/navigation";

function isStringArrayJson(input?: string | null): boolean {
  try {
    if (!input) return false;
    const parsed = JSON.parse(input);
    if (!Array.isArray(parsed)) return false;
    return !parsed.some((item) => typeof item != "string");
  } catch (e) {
    return false;
  }
}

export default function Home() {
  const data = useSearchParams().get("keyword");
  return (
    <>
      {isStringArrayJson(data) ? (
        <Result keyword={JSON.parse(data || "[]") as unknown as string[]} />
      ) : (
        <Select />
      )}
    </>
  );
}
