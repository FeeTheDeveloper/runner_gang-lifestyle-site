import AccountPortal from "@/components/AccountPortal";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AccountPage() {
  return (
    <main className="site-shell">
      <Navbar />
      <section className="section-shell pt-32">
        <div className="max-w-3xl">
          <span className="eyebrow">Runner Gang Login</span>
          <h1 className="section-heading">Customer Account</h1>
          <p className="mt-5 body-copy">
            Log in with a secure email magic link to view and track your paid Runner
            Gang orders.
          </p>
        </div>
        <AccountPortal />
      </section>
      <Footer />
    </main>
  );
}
