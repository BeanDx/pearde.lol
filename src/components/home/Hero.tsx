import { TypeAnimation } from "react-type-animation";

export default function Hero() {
  return (
    <div className="flex items-center justify-between mt-16 md:mt-20">
      <h1 className="text-4xl md:text-5xl font-semibold">
        pearde -{" "}
        <span className="inline-block min-w-[8ch]">
          <TypeAnimation
            sequence={[
              "Arch enjoyer",
              1000,
              "Frontend",
              1000,
              "C++",
              1000,
              "C#",
              1000,
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
          />
        </span>
      </h1>

      <img
        src="/avatar.jpeg"
        alt="pearde avatar"
        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-white/10 shrink-0"
      />
    </div>
  );
}
