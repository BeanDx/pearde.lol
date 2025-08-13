import { useIpWeather } from "../../hooks/useIpWeather";
import FakeTerminal from "../ui/FakeTerminal";
import { useTranslation } from "react-i18next";

const ASCII = String.raw`
    ____  _________    ____  ____  ______
   / __ \/ ____/   |  / __ \/ __ \/ ____/
  / /_/ / __/ / /| | / /_/ / / / / __/   
 / ____/ /___/ ___ |/ _, _/ /_/ / /___   
/_/   /_____/_/  |_/_/ |_/_____/_____/   
`;

export default function WeatherTerminal() {
  const { t } = useTranslation();
  const { loading, err, emoji, place, timeStr, tempC } = useIpWeather({ use24h: true });

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <FakeTerminal prompt="pearde@arch" command="weather" ascii={ASCII}>
        <pre className="whitespace-pre">
{loading
  ? "…thinking…"
  : err
    ? `⚠️ ${err}`
    : `🕒 ${timeStr}
${emoji}  ${tempC}°C, ${place}
🖥  ${t('weather_term.uptime')}: 2 days 4 hours`}
        </pre>
      </FakeTerminal>
    </div>
  );
}
