import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.searchParams.get("task")) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/try";
  return NextResponse.redirect(url);
}

export const config = { matcher: "/" };
