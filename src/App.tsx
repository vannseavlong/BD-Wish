import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useParams } from "react-router";
import { LandingScene } from "./components/LandingScene";
import { CandleBlowingScene } from "./components/CandleBlowingScene";
import { CameraCapture } from "./components/CameraCapture";
import { SurpriseScene } from "./components/SurpriseScene";

export type Scene = "landing" | "blowing" | "camera" | "surprise";

function App() {
  const { params } = useParams();
  const [currentScene, setCurrentScene] = useState<Scene>("landing");
  const [birthdayWish, setBirthdayWish] = useState("");
  const [userName, setUserName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [musicEnabled, setMusicEnabled] = useState(false);

  // Parse URL parameters
  useEffect(() => {
    // Support both path-based params (/:params?) and query string (?name=...&bd=...)
    const parsedFromPath = () => {
      if (!params) return null;
      try {
        const urlParams = new URLSearchParams(params.replace(/&&/g, "&"));
        const name = urlParams.get("name") || urlParams.get("user") || "";
        const bd =
          urlParams.get("bd") ||
          urlParams.get("bd_date") ||
          urlParams.get("birthDate") ||
          "";
        return { name, bd };
      } catch (e) {
        return null;
      }
    };

    const parsedFromQuery = () => {
      if (typeof window === "undefined") return null;
      const search = window.location.search || "";
      if (!search) return null;
      const urlParams = new URLSearchParams(search);
      const name = urlParams.get("name") || urlParams.get("user") || "";
      const bd =
        urlParams.get("bd") ||
        urlParams.get("bd_date") ||
        urlParams.get("birthDate") ||
        "";
      return { name, bd };
    };

    const fromQuery = parsedFromQuery();
    const fromPath = parsedFromPath();

    // Priority: query string > path param
    const final = fromQuery || fromPath;
    if (final) {
      setUserName(final.name || "");
      setBirthDate(final.bd || "");
    }
  }, [params]);

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
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900">
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
