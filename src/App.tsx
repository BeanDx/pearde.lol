import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

import Header from "./components/Header";
import Home from "./pages/Home";
import Rices from "./pages/Rices";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

import SplashPenguin from "./components/ui/SplashPenguin";
import AsciiMatrix from "./components/ui/AsciiMatrix"; // background rain
import Projects from "./pages/Projects";

function RouterView() {
  const location = useLocation();

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/rices" element={<Rices />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="never">
      <BrowserRouter>
        {/* gate + splash; blocks site render until done */}
        <SplashPenguin
          mode="fixed"
          duration={800}
          everyVisit={true}
          versionKey="tux_gate_v3"
        >
          {/* background layer */}
          <AsciiMatrix
            // pulls --arch from :root by default
            fadeAlpha={2}
            fontSize={10}
            speed={0.6}
            columnStride={1}
            charset="01;:+=*#ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            disableOnTouch={true}
            minWidth={768}
            zIndex={0}
          />

          {/* content above background */}
          <div className="relative z-[1]">
            <RouterView />
          </div>
        </SplashPenguin>
      </BrowserRouter>
    </MotionConfig>
  );
}
