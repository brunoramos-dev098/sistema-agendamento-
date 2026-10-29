import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
export function useLista<T>(path: string) {
  return useQuery({ queryKey: [path], queryFn: () => api<T[]>(path) });
}
