import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("Middleware executed for:", request.url);

  // Continue to the route (do nothing)
  return NextResponse.next();

  //   // Redirect
  //   return NextResponse.redirect(new URL("/login", request.url));

  //   // Rewrite (change the URL behind the scenes)
  //   return NextResponse.rewrite(new URL("/new-path", request.url));

  //   // Return a custom response
  //   return new NextResponse("Forbidden", { status: 403 });

  //   // Return JSON
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Run middleware ONLY for these paths
export const config = {
  matcher: [
    "/news/:path*", // /news and all sub-paths
    "/archive/:path*", // /archive and all sub-paths
  ],
};
