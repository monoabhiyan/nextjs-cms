import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// Use React cache to ensure only one instance per request on the server
const getServerQueryClient = cache(() => new QueryClient());
export default getServerQueryClient;
