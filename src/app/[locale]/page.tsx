import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Sourcing } from "@/components/sections/Sourcing";
import { InquiryCta } from "@/components/sections/InquiryCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Experience />
      <Sourcing />
      <InquiryCta />
    </>
  );
}
