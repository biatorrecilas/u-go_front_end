import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { SavingsChart } from "../components/SavingsChart";
import { SmartMatching } from "../components/SmartMatching"; // <- Modificado
import { Innovation } from "../components/Innovation";
import { Testimonials } from "../components/Testimonials";
import { Footer } from "../components/Footer";
import { useLocation } from "react-router";
import { fetchPlatformStats, type PlatformStats } from "../auth";

export function Home() {
  const location = useLocation();
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    let isMounted = true;
    void fetchPlatformStats()
      .then((stats) => {
        if (isMounted) setPlatformStats(stats);
      })
      .catch(() => {
        if (isMounted) setPlatformStats(null);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const sectionId = location.hash.replace("#", "");
    const targetSection = document.getElementById(sectionId);

    if (!targetSection) {
      return;
    }

    requestAnimationFrame(() => {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero stats={platformStats} />
      <Features />
      <HowItWorks />
      <SavingsChart stats={platformStats} />
      <SmartMatching />
      <Innovation stats={platformStats} />
      <Footer />
    </div>
  );
}
