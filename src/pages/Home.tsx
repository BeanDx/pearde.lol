import { TypeAnimation } from 'react-type-animation';

export default function Home() {
  return (
    <section className="space-y-10">
      <h1 className="text-4xl md:text-5xl font-semibold">
        pearde -{' '}
        <TypeAnimation
          sequence={[
            'Arch enjoyer', //text
            1000, // pause
            'Frontend',
            1000,
            'C++',
            1000,
            'C#',
            1000,
          ]}
          wrapper="span"
          cursor={true}
          repeat={Infinity} // бесконечно повторяется
        />
      </h1>
      <p className="mt-3 text-slate-300">
        // My next components...
      </p>
    </section>
  );
}
