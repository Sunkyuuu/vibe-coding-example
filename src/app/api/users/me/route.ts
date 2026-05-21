import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null, profile: null }, { status: 200 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  return NextResponse.json({ user, profile });
}

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body?.name ?? "").trim();
  const department = String(body?.department ?? "").trim();

  if (!name || !department) {
    return NextResponse.json({ error: "name and department are required" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "already exists" }, { status: 409 });
  }

  const { data, error } = await supabase
    .from("users")
    .insert({
      auth_user_id: user.id,
      email: user.email ?? "",
      name,
      department,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
