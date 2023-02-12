import { useDebugValue } from "react";
import { useLocation } from "wouter";

export default function useSearchParams() {
  useLocation();
  const url = new URL(window.location.href);
  const { searchParams } = url;
  useDebugValue(searchParams);
  return searchParams;
}
