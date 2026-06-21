import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OWNER_EMAIL = "rizaedtz@gmail.com";
const OWNER_PASSWORD = "riza189";
const OWNER_NAME = "rizanime";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Try to find existing user
    let userId: string | null = null;
    const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existing = list?.users.find((u) => u.email?.toLowerCase() === OWNER_EMAIL);

    if (existing) {
      userId = existing.id;
      await supabase.auth.admin.updateUserById(userId, {
        password: OWNER_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: OWNER_NAME },
      });
    } else {
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: OWNER_EMAIL,
        password: OWNER_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: OWNER_NAME },
      });
      if (createErr) throw createErr;
      userId = created.user!.id;
    }

    // Upsert profile
    await supabase.from("profiles").upsert(
      { user_id: userId, display_name: OWNER_NAME },
      { onConflict: "user_id" }
    );

    // Ensure owner role
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const hasOwner = roles?.some((r: any) => r.role === "owner");
    if (!hasOwner) {
      await supabase.from("user_roles").insert({ user_id: userId, role: "owner" });
    }

    return new Response(
      JSON.stringify({ ok: true, user_id: userId, email: OWNER_EMAIL, role: "owner" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});