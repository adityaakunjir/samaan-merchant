import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // For .NET API authentication, we use JWT tokens stored in localStorage
  // Auth protection is handled at the page/component level
  // This middleware just passes requests through
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
