import FakeTerminal from "../ui/FakeTerminal";

export default function Bio() {
  return (
    <section className="max-w-6xl mx-auto space-y-6">
      <FakeTerminal
        prompt="max@archlinux"
        command="fastfetch"
        ascii={String.raw`
    ____  _________    ____  ____  ______
   / __ \/ ____/   |  / __ \/ __ \/ ____/
  / /_/ / __/ / /| | / /_/ / / / / __/   
 / ____/ /___/ ___ |/ _, _/ /_/ / /___   
/_/   /_____/_/  |_/_/ |_/_____/_____/   
`}
      >
        <dl
          className="mt-3 grid gap-x-4 gap-y-1 break-words"
          style={{ gridTemplateColumns: "max-content 1fr" }}
        >
          <dt className="text-yellow-300">Name</dt>
          <dd>Max</dd>

          <dt className="text-yellow-300">Age</dt>
          <dd>19</dd>

          <dt className="text-yellow-300">Location</dt>
          <dd>Cologne, Germany</dd>

          <dt className="text-yellow-300">OS</dt>
          <dd>Arch Linux (bspwm / hyprland / KDE (wayland))</dd>

          <dt className="text-yellow-300">Languages</dt>
          <dd>C++, C#, JavaScript</dd>

          <dt className="text-yellow-300">Info</dt>
          <dd className="text-green-300/90 leading-relaxed">
            Frontend enjoyer, React clicker, ex-C# sorcerer, C++ pointer tamer,
            touched Kotlin once and survived. Knows enough code to make things
            work (and sometimes even look pretty).
          </dd>
        </dl>
      </FakeTerminal>
    </section>
  );
}
