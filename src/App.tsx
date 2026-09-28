import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LandingScene } from "./components/LandingScene";
import { CandleBlowingScene } from "./components/CandleBlowingScene";
import { CameraCapture } from "./components/CameraCapture";
import { SurpriseScene } from "./components/SurpriseScene";

export type Scene = "landing" | "blowing" | "camera" | "surprise";

function App() {
  const [currentScene, setCurrentScene] = useState<Scene>("landing");
  const [birthdayWish, setBirthdayWish] = useState("");
  const [userName, setUserName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [musicEnabled, setMusicEnabled] = useState(false);

  // Parse personalization from the query string, e.g. ?name=Alex&bd=July04
  useEffect(() => {
    const search = window.location.search;
    if (!search) return;

    const urlParams = new URLSearchParams(search);
    const name = urlParams.get("name") || urlParams.get("user") || "";
    const bd =
      urlParams.get("bd") ||
      urlParams.get("bd_date") ||
      urlParams.get("birthDate") ||
      "";

    if (name) setUserName(name);
    if (bd) setBirthDate(bd);
  }, []);

  const handleStartSurprise = (wish: string) => {
    setBirthdayWish(wish);
    setCurrentScene("blowing");
  };

  const handleCandlesBlownOut = () => {
    setMusicEnabled(true);
    setTimeout(() => {
      setCurrentScene("camera");
    }, 2000);
  };

  const handlePhotoTaken = (photoDataUrl: string) => {
    setUserPhoto(photoDataUrl);
    setCurrentScene("surprise");
  };

  const handleReplay = () => {
    setMusicEnabled(false);
    setBirthdayWish("");
    setUserPhoto("");
    setCurrentScene("landing");
  };

  return (
    <div className="party-surface relative w-full min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScene === "landing" && (
          <LandingScene
            key="landing"
            userName={userName}
            birthDate={birthDate}
            onStartSurprise={handleStartSurprise}
          />
        )}
        {currentScene === "blowing" && (
          <CandleBlowingScene
            key="blowing"
            userName={userName}
            onCandlesBlownOut={handleCandlesBlownOut}
          />
        )}
        {currentScene === "camera" && (
          <CameraCapture
            key="camera"
            userName={userName}
            onPhotoTaken={handlePhotoTaken}
          />
        )}
        {currentScene === "surprise" && (
          <SurpriseScene
            key="surprise"
            userName={userName}
            birthDate={birthDate}
            wish={birthdayWish}
            userPhoto={userPhoto}
            musicEnabled={musicEnabled}
            onMusicToggle={() => setMusicEnabled(!musicEnabled)}
            onReplay={handleReplay}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
