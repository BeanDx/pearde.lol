import Hero from "../components/home/Hero";
import Bio from "../components/home/Bio";
import Timeline from "../components/home/Timeline";

export default function Home() {
  return (
    <section className="space-y-10">
      <Hero />
      <Bio />
      <Timeline />
    </section>
  );
}
