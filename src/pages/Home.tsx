import Hero from "../components/home/Hero";
import Bio from "../components/home/Bio";
import Timeline from "../components/home/Timeline";
import WeatherTerminal from "../components/home/WeatherTerminal";

export default function Home() {
  return (
    <section className="space-y-10">
      <Hero />
      <Bio />
      <WeatherTerminal />
      <Timeline />

    </section>
  );
}
