"use server";

import { authActionClient } from "@/lib/auth/actions";
import { Axios } from "@/lib/utils";

export const $fetchSellerCarsAction = authActionClient.action(async (args) => {
  try {
    // @ts-ignore
    const token = args.ctx.session?.accessToken;
    const Authorization = `Bearer ${token}`;
    const response = await Axios.get("/seller/fetch/cars", {
      headers: {
        Authorization,
      },
    });
    console.log(response.data, 'server...');
    return response.data;
  } catch (e) {
    console.log(e);
  }
});
