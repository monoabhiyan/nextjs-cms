import { makeSellerCarsQueryKey } from "@/features/admin/seller-cars/utils";
import { fetchSellerCars } from "@/features/admin/seller-cars/api/seller-cars";

export function useSellerCarsQuery(queryInput: {
  perPage: string;
  page: string;
}) {
  return {
    queryKey: makeSellerCarsQueryKey(queryInput),
    queryFn: () => {
      return fetchSellerCars()
    },
    throwOnError: true,
  };
}
