import { getQueryClient } from "@/lib/react-query/getQueryClient";
import { makeOrdersQueryKey } from "@/features/admin/products/constants";
import { parseAsJson, parseAsString } from "nuqs/server";
import { ProductQueryInput } from "@/features/admin/products/action";
import { sortingStateSchema } from "@/features/admin/products/schema";
import { fetchProductsQuery } from "@/features/admin/products/api/products";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import OrderClientComponent from "@/features/admin/orders/components/OrderClientComponent";

// Define the Zod schema for sorting state again (or import if shared)
const sortParser = parseAsJson(sortingStateSchema.parse);

type successParsing = string | undefined;
export default async function OrderServerComponent({
  searchParams,
}: {
  searchParams?: ProductQueryInput;
}) {
  const queryClient = getQueryClient();

  const sort = sortParser
    .withDefault([])
    .parseServerSide(searchParams?.sort as successParsing);

  const page = parseAsString
    .withDefault("1")
    .parseServerSide(searchParams?.page as successParsing);

  const perPage = parseAsString
    .withDefault("10")
    .parseServerSide(searchParams?.perPage as successParsing);

  const queryInput: ProductQueryInput = {
    sort,
    perPage,
    page,
  };

  await queryClient.prefetchQuery({
    queryKey: makeOrdersQueryKey(queryInput),
    queryFn: () => fetchProductsQuery(queryInput),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderClientComponent />
    </HydrationBoundary>
  );
}
