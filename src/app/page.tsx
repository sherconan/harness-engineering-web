import { HeroSection } from "../components/sections/HeroSection";
import { ExecutiveSummarySection } from "../components/sections/ExecutiveSummarySection";
import { Part1Section } from "../components/sections/Part1Section";
import { Part2Section } from "../components/sections/Part2Section";
import { Part2DeepDiveSection } from "../components/sections/Part2DeepDiveSection";
import { Part3Section } from "../components/sections/Part3Section";
import { Part4Section } from "../components/sections/Part4Section";
import { Part5Section } from "../components/sections/Part5Section";
import { FinanceSection } from "../components/sections/FinanceSection";
import { FooterSection } from "../components/sections/FooterSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ExecutiveSummarySection />
      <Part1Section />
      <Part2Section />
      <Part3Section />
      <Part2DeepDiveSection />
      <Part4Section />
      <Part5Section />
      <FinanceSection />
      <FooterSection />
    </main>
  );
}
