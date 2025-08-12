import { useEffect, useMemo, useState } from "react";

type Geo = { lat: number; lon: number; city?: string; country?: string };
type Weather = {
  temp: number;
  code: number;
  wind: number;
  time: string; 
  timezone: string;
  fetchedAt: number;
};

type Options = {
  ttlMs?: number;   // how long to store weather in cache default 10 min
  use24h?: boolean;
};

const WC_EMOJI: Record<number, string> = {
  0:"☀️",1:"🌤",2:"⛅️",3:"☁️",
  45:"🌫",48:"🌫",
  51:"🌦",53:"🌦",55:"🌧",
  61:"🌧",63:"🌧",65:"🌧",
  71:"❄️",73:"❄️",75:"❄️",
  80:"🌧",81:"🌧",82:"⛈",
  95:"⛈",96:"⛈",99:"⛈"
};

// ---------- helpers ----------
async function geoByIP(): Promise<Geo> {
  // provider #1
  try {
    const r = await fetch("https://ipapi.co/json/");
    if (r.ok) {
      const j = await r.json();
      if (j?.latitude && j?.longitude) {
        return { lat: j.latitude, lon: j.longitude, city: j.city, country: j.country };
      }
    }
  } catch {}
  // provider #2 (fallback)
  const r2 = await fetch("https://ipinfo.io/json", { cache: "no-store" });
  const j2 = await r2.json();
  const [latS, lonS] = String(j2.loc || "").split(",");
  const lat = Number(latS), lon = Number(lonS);
  if (!isFinite(lat) || !isFinite(lon)) throw new Error("IP geo failed");
  return { lat, lon, city: j2.city, country: j2.country };
}

async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&timezone=auto`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("weather fetch failed");
  const j = await r.json();
  return {
    temp: j.current.temperature_2m,
    code: j.current.weather_code,
    wind: j.current.wind_speed_10m,
    time: j.current.time,
    timezone: j.timezone,
    fetchedAt: Date.now(),
  };
}

function formatTime(now: Date, tz?: string, use24h = false) {
  const timeZone = tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24h,
    timeZone,
  }).format(now);
}

// ---------- the hook ----------
export function useIpWeather(options: Options = {}) {
  const { ttlMs = 10 * 60 * 1000, use24h = false } = options;

  const [geo, setGeo] = useState<Geo | null>(null);
  const [wx, setWx] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        // GEO (cache for session)
        let g: Geo | null = null;
        try { g = JSON.parse(sessionStorage.getItem("ipgeo") || "null"); } catch {}
        if (!g) {
          g = await geoByIP();
          sessionStorage.setItem("ipgeo", JSON.stringify(g));
        }
        if (aborted) return;
        setGeo(g);

        // WEATHER (TTL)
        let w: Weather | null = null;
        try { w = JSON.parse(sessionStorage.getItem("ipwx") || "null"); } catch {}
        const expired = !w || (Date.now() - w.fetchedAt > ttlMs);
        if (expired) {
          w = await fetchWeather(g.lat, g.lon);
          sessionStorage.setItem("ipwx", JSON.stringify(w));
        }
        if (aborted) return;
        setWx(w);
      } catch (e) {
        setErr((e as Error).message || "failed");
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => { aborted = true; };
  }, [ttlMs]);

  const emoji = wx ? (WC_EMOJI[wx.code] ?? "🌡") : "";
  const place = useMemo(() => {
    if (!geo) return "your area";
    return geo.city ? `${geo.city}${geo.country ? ", " + geo.country : ""}` : "your area";
  }, [geo]);

  const timeStr = useMemo(() => formatTime(now, wx?.timezone, use24h), [now, wx?.timezone, use24h]);

  const tempC = wx ? Math.round(wx.temp) : null;
  const wind = wx ? Math.round(wx.wind) : null;

  return {
    loading,
    err,

    geo,
    wx,

    emoji,
    place,
    timeStr,
    tempC,
    wind,

    // сервис
    clearCaches: () => {
      sessionStorage.removeItem("ipgeo");
      sessionStorage.removeItem("ipwx");
    },
  };
}