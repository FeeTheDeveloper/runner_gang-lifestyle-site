"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { isCheckoutEligibleItem } from "@/lib/checkout";
import { CONTACT_EMAIL } from "@/lib/site";
import { stripePromise } from "@/lib/stripe-client";
import { formatCurrency } from "@/lib/storefront";

type ShippingFormState = {
  fullName: string;
  email: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

type ShippingFormErrors = Partial<Record<keyof ShippingFormState, string>>;

const initialFormState: ShippingFormState = {
  fullName: "",
  email: "",
  address1: "",
  city: "",
  state: "",
  zip: "",
  country: "US"
};

function validateShipping(formState: ShippingFormState) {
  const errors: ShippingFormErrors = {};

  if (!formState.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!formState.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!formState.address1.trim()) {
    errors.address1 = "Address is required.";
  }

  if (!formState.city.trim()) {
    errors.city = "City is required.";
  }

  if (!formState.state.trim()) {
    errors.state = "State is required.";
  }

  if (!formState.zip.trim()) {
    errors.zip = "ZIP code is required.";
  }

  if (!formState.country.trim()) {
    errors.country = "Country is required.";
  }

  return errors;
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { totalEstimate } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const returnUrl = `${window.location.origin}/order-confirmed`;
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl
      }
    });

    if (result.error) {
      setErrorMessage(result.error.message ?? "Payment confirmation failed.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border border-bone/10 bg-obsidian/70 p-4">
        <PaymentElement />
      </div>

      {errorMessage ? (
        <p className="font-body text-sm uppercase tracking-[0.18em] text-ember">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="luxury-button w-full border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Processing {formatCurrency(totalEstimate)}
          </span>
        ) : (
          `Pay ${formatCurrency(totalEstimate)}`
        )}
      </button>
    </form>
  );
}

export default function CheckoutModal() {
  const { items, isCheckoutOpen, closeCheckout, totalEstimate } = useCart();
  const hasUnsupportedItems = items.some((item) => !isCheckoutEligibleItem(item));
  const [step, setStep] = useState<1 | 2>(1);
  const [formState, setFormState] = useState<ShippingFormState>(initialFormState);
  const [errors, setErrors] = useState<ShippingFormErrors>({});
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (!isCheckoutOpen) {
      setStep(1);
      setErrors({});
      setClientSecret(null);
      setCheckoutError(null);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isCheckoutOpen]);

  function updateField(field: keyof ShippingFormState, value: string) {
    setFormState((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleContinue() {
    const nextErrors = validateShipping(formState);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (items.length === 0) {
      setCheckoutError("Add at least one item before opening checkout.");
      return;
    }

    if (hasUnsupportedItems) {
      setCheckoutError(
        `This cart includes launch preview items. Email ${CONTACT_EMAIL} for manual ordering.`
      );
      return;
    }

    try {
      setIsCreatingIntent(true);
      setCheckoutError(null);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
            catalogSource: item.catalogSource
          })),
          customerEmail: formState.email,
          shippingAddress: {
            name: formState.fullName,
            address1: formState.address1,
            city: formState.city,
            state: formState.state,
            zip: formState.zip,
            country: formState.country
          }
        })
      });

      const data = (await response.json()) as { clientSecret?: string; error?: string };

      if (!response.ok || !data.clientSecret) {
        throw new Error(data.error ?? "Unable to initialize Stripe checkout.");
      }

      setClientSecret(data.clientSecret);
      setStep(2);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to initialize checkout."
      );
    } finally {
      setIsCreatingIntent(false);
    }
  }

  return (
    <AnimatePresence>
      {isCheckoutOpen ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-obsidian/80 backdrop-blur-sm"
            aria-label="Close checkout overlay"
            onClick={closeCheckout}
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
          >
            <div className="relative w-full max-w-lg border border-bone/10 bg-smoke shadow-gold">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ember via-gold to-transparent" />
              <button
                type="button"
                onClick={closeCheckout}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center border border-bone/10 bg-obsidian/80 text-bone"
                aria-label="Close checkout"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="p-6 sm:p-8">
                <div className="pr-12">
                  <p className="font-body text-xs uppercase tracking-[0.36em] text-gold">
                    Secure Checkout
                  </p>
                  <h2 className="mt-3 font-display text-5xl uppercase leading-none tracking-[0.14em] text-bone">
                    {step === 1 ? "Step 1 / Shipping" : "Step 2 / Payment"}
                  </h2>
                  <p className="mt-4 font-body text-sm uppercase tracking-[0.18em] text-ash">
                    Total due today: {formatCurrency(totalEstimate)}
                  </p>
                </div>

                {items.length === 0 ? (
                  <div className="mt-8 border border-bone/10 bg-obsidian/70 p-6 text-center">
                    <p className="font-body text-sm uppercase tracking-[0.18em] text-ash">
                      Your cart is empty. Add a live product to continue.
                    </p>
                  </div>
                ) : hasUnsupportedItems ? (
                  <div className="mt-8 border border-bone/10 bg-obsidian/70 p-6 text-center">
                    <p className="font-body text-sm uppercase tracking-[0.18em] text-ash">
                      This cart includes launch preview items that are not wired to
                      live fulfillment.
                    </p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="luxury-button mt-5 border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
                    >
                      Email to Order
                    </a>
                  </div>
                ) : step === 1 ? (
                  <div className="mt-8 space-y-4">
                    <div>
                      <label className="mb-2 block font-body text-[11px] uppercase tracking-[0.3em] text-gold">
                        Full Name
                      </label>
                      <input
                        value={formState.fullName}
                        onChange={(event) => updateField("fullName", event.target.value)}
                        className="luxury-input"
                        placeholder="Runner Gang Customer"
                      />
                      {errors.fullName ? (
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ember">
                          {errors.fullName}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-2 block font-body text-[11px] uppercase tracking-[0.3em] text-gold">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        className="luxury-input"
                        placeholder="you@example.com"
                      />
                      {errors.email ? (
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ember">
                          {errors.email}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-2 block font-body text-[11px] uppercase tracking-[0.3em] text-gold">
                        Address Line 1
                      </label>
                      <input
                        value={formState.address1}
                        onChange={(event) => updateField("address1", event.target.value)}
                        className="luxury-input"
                        placeholder="123 Culture Ave"
                      />
                      {errors.address1 ? (
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ember">
                          {errors.address1}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block font-body text-[11px] uppercase tracking-[0.3em] text-gold">
                          City
                        </label>
                        <input
                          value={formState.city}
                          onChange={(event) => updateField("city", event.target.value)}
                          className="luxury-input"
                          placeholder="Chicago"
                        />
                        {errors.city ? (
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ember">
                            {errors.city}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label className="mb-2 block font-body text-[11px] uppercase tracking-[0.3em] text-gold">
                          State
                        </label>
                        <input
                          value={formState.state}
                          onChange={(event) => updateField("state", event.target.value)}
                          className="luxury-input"
                          placeholder="IL"
                        />
                        {errors.state ? (
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ember">
                            {errors.state}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label className="mb-2 block font-body text-[11px] uppercase tracking-[0.3em] text-gold">
                          ZIP
                        </label>
                        <input
                          value={formState.zip}
                          onChange={(event) => updateField("zip", event.target.value)}
                          className="luxury-input"
                          placeholder="60601"
                        />
                        {errors.zip ? (
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ember">
                            {errors.zip}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label className="mb-2 block font-body text-[11px] uppercase tracking-[0.3em] text-gold">
                          Country
                        </label>
                        <input
                          value={formState.country}
                          onChange={(event) => updateField("country", event.target.value)}
                          className="luxury-input"
                          placeholder="US"
                        />
                        {errors.country ? (
                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ember">
                            {errors.country}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {checkoutError ? (
                      <p className="font-body text-sm uppercase tracking-[0.18em] text-ember">
                        {checkoutError}
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={isCreatingIntent}
                      className="luxury-button w-full border-ember bg-ember text-bone hover:border-sunset hover:bg-sunset"
                    >
                      {isCreatingIntent ? (
                        <span className="inline-flex items-center gap-2">
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          Initializing Payment
                        </span>
                      ) : (
                        "Continue to Payment"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="mt-8">
                    {clientSecret ? (
                      <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret,
                          appearance: {
                            theme: "night",
                            variables: {
                              colorPrimary: "#D4A853",
                              colorBackground: "#0A0A0A",
                              colorText: "#F0EBE3",
                              colorDanger: "#C45C1A",
                              borderRadius: "2px"
                            }
                          }
                        }}
                      >
                        <PaymentForm />
                      </Elements>
                    ) : (
                      <p className="font-body text-sm uppercase tracking-[0.18em] text-ash">
                        Waiting on Stripe checkout initialization.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
