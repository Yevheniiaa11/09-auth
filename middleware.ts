import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
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
          const response = isPublicRoute
            ? NextResponse.redirect(new URL("/profile", request.url))
            : NextResponse.next();

          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);

            const options = {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path || "/",
              maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax" as const,
            };

            if (parsed.accessToken) {
              response.cookies.set("accessToken", parsed.accessToken, options);
            }
            if (parsed.refreshToken) {
              response.cookies.set(
                "refreshToken",
                parsed.refreshToken,
                options
              );
            }
          }

          return response;
        }
      } catch (err) {
        console.error(
          "Session check failed:",
          err instanceof Error ? err.message : err
        );

        // Якщо помилка перевірки refresh токена — редірект на sign-in
        if (isPrivateRoute) {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }

        // Якщо публічний маршрут — просто пропускаємо
        return NextResponse.next();
      }
    }

    // Якщо взагалі немає accessToken і refreshToken
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  }

  // Якщо accessToken є
  if (isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/sign-in", "/sign-up"],
};
