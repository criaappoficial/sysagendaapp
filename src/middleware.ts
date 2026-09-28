import { auth } from "@/lib/auth/server";

export default auth.middleware({ loginUrl: "/auth/sign-in" });

export const config = {
  matcher: ["/companies/:path*", "/contacts/:path*", "/meetings/:path*", "/dashboard/:path*"],
};
