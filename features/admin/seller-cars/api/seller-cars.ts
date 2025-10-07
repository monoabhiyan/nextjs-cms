import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/nextAuth";
import { Axios } from "@/lib/utils";

export async function fetchSellerCars() {
  const session = await getServerSession(nextAuthOptions);
  if (session) return new Error("Unauthorized");

  const { data } = await Axios.get("/seller/fetch/cars", {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return data;
}
