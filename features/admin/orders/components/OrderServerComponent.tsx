import { parseAsJson, parseAsString } from "nuqs/server";
import { ProductQueryInput } from "@/features/admin/products/action";
import { sortingStateSchema } from "@/features/admin/products/schema";
import OrderClientComponent from "@/features/admin/orders/components/OrderClientComponent";
import { getQueryClient } from "@/lib/react-query/getQueryClient";
import { useProductsQuery } from "@/features/admin/products/hooks/useProductsQuery";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

// Define the Zod schema for sorting state again (or import if shared)
const sortParser = parseAsJson(sortingStateSchema.parse);

type successParsing = string | undefined;
export default async function OrderServerComponent({
  searchParams,
}: {
  searchParams?: ProductQueryInput;
}) {
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

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(useProductsQuery(queryInput));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderClientComponent />
    </HydrationBoundary>
  );
}
