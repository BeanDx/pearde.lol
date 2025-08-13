import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

import Header from "./components/Header";
import Home from "./pages/Home";
import Rices from "./pages/Rices";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

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
        <RouterView />
      </BrowserRouter>
    </MotionConfig>
  );
}
