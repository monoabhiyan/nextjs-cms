export function makeSellerCarsQueryKey(input: unknown) {
  return ["seller-cars", Number(input.page), Number(input.perPage)];
}
