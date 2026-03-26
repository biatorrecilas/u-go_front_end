import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { SavingsChart } from "../components/SavingsChart";
import { RouteMap } from "../components/RouteMap";
import { Innovation } from "../components/Innovation";
import { Testimonials } from "../components/Testimonials";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <SavingsChart />
      <RouteMap />
      <Innovation />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
