import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { parse } from "cookie";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const apiRes = await api.post("/auth/register", body);
    const setCookie = apiRes.headers["set-cookie"];
    const res = NextResponse.json(apiRes.data);

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
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
          res.cookies.set("accessToken", parsed.accessToken, options);
        }
        if (parsed.refreshToken) {
          res.cookies.set("refreshToken", parsed.refreshToken, options);
        }
      }
    }

    return res;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  }
}
