"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type AccountOrder = {
  id: string;
  created_at: string;
  status: string;
  channel: string;
  amount_total: number;
  currency: string;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase()
  }).format(amount);
}

export default function AccountPortal() {
  const [email, setEmail] = useState("");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => {
    try {
      return getSupabaseBrowserClient();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const initializeSession = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        return;
      }

      setSessionEmail(data.session?.user.email ?? null);
    };

    initializeSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user.email ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !sessionEmail) {
      setOrders([]);
      return;
    }

    const loadOrders = async () => {
      setIsLoadingOrders(true);
      setError(null);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session?.access_token) {
        setError(sessionError?.message ?? "Could not verify your account session.");
        setIsLoadingOrders(false);
        return;
      }

      const response = await fetch("/api/account/orders", {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`
        }
      });
      const payload = (await response.json()) as {
        orders?: AccountOrder[];
        error?: string;
      };

      if (!response.ok) {
        setError(payload.error ?? "Unable to load your orders.");
        setOrders([]);
        setIsLoadingOrders(false);
        return;
      }

      setOrders(payload.orders ?? []);
      setIsLoadingOrders(false);
    };

    loadOrders();
  }, [sessionEmail, supabase]);

  async function handleSendMagicLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setError(
        "Supabase account login is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setIsSendingLink(true);
    setError(null);
    setNotice(null);

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/account`
      }
    });

    if (authError) {
      setError(authError.message);
      setIsSendingLink(false);
      return;
    }

    setNotice("Magic link sent. Check your email to log in and track your orders.");
    setIsSendingLink(false);
  }

  async function handleSignOut() {
    if (!supabase) {
      return;
    }

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    setSessionEmail(null);
    setOrders([]);
    setNotice("Signed out successfully.");
  }

  return (
    <section className="mt-10 border border-gold/20 bg-smoke/70 p-6 sm:p-8">
      <p className="eyebrow">Customer Account</p>
      <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.1em] text-bone sm:text-5xl">
        Track your orders
      </h2>

      {!sessionEmail ? (
        <form onSubmit={handleSendMagicLink} className="mt-8 space-y-4">
          <label className="block">
            <span className="font-body text-xs uppercase tracking-[0.28em] text-gold">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full border border-bone/20 bg-obsidian px-3 py-3 font-body text-sm text-bone focus:border-gold focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={isSendingLink}
            className="luxury-button w-full border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
          >
            {isSendingLink ? "Sending link..." : "Email me a login link"}
          </button>
        </form>
      ) : (
        <div className="mt-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-body text-xs uppercase tracking-[0.24em] text-ash">
              Signed in as <span className="text-bone">{sessionEmail}</span>
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              className="luxury-button border-gold/40 bg-transparent text-bone hover:border-gold hover:text-gold"
            >
              Sign out
            </button>
          </div>

          {isLoadingOrders ? (
            <p className="font-body text-xs uppercase tracking-[0.24em] text-ash">
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <p className="font-body text-xs uppercase tracking-[0.24em] text-ash">
              No paid orders yet for this account.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="border border-bone/10 bg-obsidian/70 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-body text-xs uppercase tracking-[0.24em] text-gold">
                      {order.channel}
                    </p>
                    <p className="font-body text-xs uppercase tracking-[0.24em] text-ash">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-2 font-display text-3xl uppercase tracking-[0.08em] text-bone">
                    {formatCurrency(order.amount_total, order.currency)}
                  </p>
                  <p className="mt-2 font-body text-xs uppercase tracking-[0.24em] text-ash">
                    Status: {order.status}
                  </p>
                  <p className="mt-2 font-body text-xs uppercase tracking-[0.24em] text-ash break-all">
                    Payment: {order.stripe_payment_intent_id ?? order.stripe_checkout_session_id}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {notice ? (
        <p className="mt-5 font-body text-xs uppercase tracking-[0.24em] text-gold">{notice}</p>
      ) : null}
      {error ? (
        <p className="mt-5 font-body text-xs uppercase tracking-[0.24em] text-ember">{error}</p>
      ) : null}
    </section>
  );
}
