import { useQuery } from "@tanstack/react-query";

import {
  getFoundItems,
  foundItemsKeys,
  type GetFoundItemsParams,
} from "@/lib/api/found-items.queries";

export function useFoundItems(filters: GetFoundItemsParams = {}) {
  return useQuery({
    queryKey: foundItemsKeys.list(filters),
    queryFn: () => getFoundItems(filters),
  });
}