export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { api } from "../../api";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const { data } = await api.get(
      "https://notehub-api.goit.study/api/users/me",
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    if (data) return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const body = await request.json();

    const { data } = await api.patch("/users/me", body, {
      headers: {
        Cookie: cookie,
      },
    });

    if (data) return NextResponse.json(data);

    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
