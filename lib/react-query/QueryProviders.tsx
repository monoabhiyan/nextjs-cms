"use client";

import React from "react";
import {
  QueryClientProvider,
} from "@tanstack/react-query";
// Optional: If you want React Query DevTools
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/react-query/getQueryClient";
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: Avoid useState when initializing the query client if you are
  //       suspending rendering inside nested components. It will cause
  //       the client to be recreated continually.
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Optional: React Query DevTools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
