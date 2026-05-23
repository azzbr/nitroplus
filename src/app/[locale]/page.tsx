import { Hero } from "@/components/sections/Hero";
import { VehiclePicker } from "@/components/sections/VehiclePicker";
import { Experience } from "@/components/sections/Experience";
import { Sourcing } from "@/components/sections/Sourcing";
import { InquiryCta } from "@/components/sections/InquiryCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <VehiclePicker />
      <Experience />
      <Sourcing />
      <InquiryCta />
    </>
  );
}
