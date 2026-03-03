"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IntroSequence } from "@/components/shared/IntroSequence";
import { Constellation, Girl } from "@/components/constellations";
import { GirlIntro } from "@/components/shared/GirlIntro";
import { UnityPage } from "@/components/shared/UnityPage";
import { PreloadAssets } from "@/components/shared/PreloadAssets";
import {
  AlyokUniverse,
  SabininaUniverse,
  NazkenUniverse,
  MolyaUniverse,
  ZhansikoUniverse,
  OliyashUniverse,
  ArdashonUniverse,
} from "@/components/universes";

const GIRLS = [
  { id: "alyok",    name: "Alyok",    color: "#ff007f" },
  { id: "sabinina", name: "Sabinina", color: "#00f0ff" },
  { id: "nazken",   name: "Nazken",   color: "#ffb800" },
  { id: "molya",    name: "Molya",    color: "#b500ff" },
  { id: "zhansiko", name: "Zhansiko", color: "#ff2a00" },
  { id: "oliyash",  name: "Oliyash",  color: "#00ffa3" },
  { id: "ardashon", name: "Ardashon", color: "#ff8c00" },
];

type AppPhase = "intro" | "constellation" | "girlIntro" | "girl" | "unity";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("intro");
  const [activeGirl, setActiveGirl] = useState<Girl | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());

  const handleSelectGirl = (girl: Girl) => {
    setActiveGirl(girl);
    setPhase("girlIntro"); // Show intro first
  };

  const handleIntroComplete = () => {
    setPhase("girl"); // Transition to games after intro
  };

  const handleGirlBack = () => {
    if (activeGirl) {
      setVisited((prev) => {
        const newSet = new Set(prev);
        newSet.add(activeGirl.id);
        return newSet;
      });
    }
    setActiveGirl(null);
    setPhase("constellation");
  };

  return (
    <div className="w-screen h-screen bg-[#05050a] text-white overflow-hidden">
      {/* Preload all assets in background */}
      <PreloadAssets />
      
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" className="w-full h-full">
            <IntroSequence onComplete={() => setPhase("constellation")} />
          </motion.div>
        )}

        {phase === "constellation" && (
          <motion.div key="constellation" className="w-full h-full">
            <Constellation
              visited={visited}
              onSelect={handleSelectGirl}
              onUnity={() => setPhase("unity")}
            />
          </motion.div>
        )}

        {phase === "girlIntro" && activeGirl && (
          <motion.div key="girlIntro" className="w-full h-full">
            <GirlIntro girl={activeGirl} onComplete={handleIntroComplete} />
          </motion.div>
        )}

        {phase === "girl" && activeGirl && (
          <motion.div key={`girl-${activeGirl.id}`} className="w-full h-full">
            {activeGirl.id === "alyok"    && <AlyokUniverse    onBack={handleGirlBack} />}
            {activeGirl.id === "sabinina" && <SabininaUniverse onBack={handleGirlBack} />}
            {activeGirl.id === "nazken"   && <NazkenUniverse   onBack={handleGirlBack} />}
            {activeGirl.id === "molya"    && <MolyaUniverse    onBack={handleGirlBack} />}
            {activeGirl.id === "zhansiko" && <ZhansikoUniverse onBack={handleGirlBack} />}
            {activeGirl.id === "oliyash"  && <OliyashUniverse  onBack={handleGirlBack} />}
            {activeGirl.id === "ardashon" && <ArdashonUniverse onBack={handleGirlBack} />}
          </motion.div>
        )}

        {phase === "unity" && (
          <motion.div key="unity" className="w-full h-full">
            <UnityPage onBack={() => setPhase("constellation")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
