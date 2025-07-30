"use client";

import { withRequiredAuth } from "@/lib/hocs/with-auth";

function ULayoutComponent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withRequiredAuth(ULayoutComponent);
