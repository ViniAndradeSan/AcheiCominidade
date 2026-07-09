import { useQuery } from "@tanstack/react-query";

import {
  getFoundItem,
  foundItemsKeys,
} from "@/lib/api/found-items.queries";

export function useFoundItem(id: string | undefined) {
  return useQuery({
    queryKey: foundItemsKeys.detail(id as string),
    queryFn: () => getFoundItem(id as string),
    enabled: Boolean(id),
  });
}