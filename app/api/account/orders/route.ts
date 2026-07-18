import { NextResponse } from "next/server";
import { listOrdersForCustomerEmail } from "@/lib/orders";
import { getAuthenticatedSupabaseUser } from "@/lib/supabase-server";
import { isSupabaseServerConfigured } from "@/lib/env";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      {
        error:
          "Order tracking is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
      },
      { status: 500 }
    );
  }

  try {
    const user = await getAuthenticatedSupabaseUser(
      request.headers.get("authorization")
    );

    if (!user.email) {
      return NextResponse.json(
        { error: "Authenticated user is missing an email address." },
        { status: 400 }
      );
    }

    const orders = await listOrdersForCustomerEmail(user.email);
    return NextResponse.json({ orders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load account orders.";
    const status =
      message === "Missing bearer token." || message === "Invalid or expired session token."
        ? 401
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
