import { NextRequest, NextResponse } from "next/server";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Якщо accessToken немає
  if (!accessToken) {
    // Якщо є refreshToken — перевіряємо сесію
    if (refreshToken) {
      try {
        const data = await checkServerSession();
        const setCookie = data.headers["set-cookie"];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          const response = isPublicRoute
            ? NextResponse.redirect(new URL("/profile", request.url))
            : NextResponse.next();

          // УВАГА: ми не використовуємо `.cookies.set`, а додаємо Set-Cookie заголовки
          response.headers.set("Set-Cookie", cookieArray.join(", "));

          return response;
        }
      } catch (err) {
        console.error(
          "Session check failed:",
          err instanceof Error ? err.message : err
        );

        if (isPrivateRoute) {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }

        return NextResponse.next();
      }
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  }

  // Якщо accessToken існує
  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/sign-in", "/sign-up"],
};
