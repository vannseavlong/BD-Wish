import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Fireworks } from "./Fireworks";
import { FloatingParticles } from "./FloatingParticles";
import { DownloadableCard } from "./DownloadableCard";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

interface SurpriseSceneProps {
  userName: string;
  birthDate: string;
  wish: string;
  userPhoto: string;
  musicEnabled: boolean;
  onMusicToggle: () => void;
  onReplay: () => void;
}

export function SurpriseScene({
  userName,
  birthDate,
  wish,
  userPhoto,
  musicEnabled,
  onMusicToggle,
  onReplay,
}: SurpriseSceneProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < wish.length) {
        setDisplayedText(wish.slice(0, index + 1));
        index++;
      } else {
        setTypingComplete(true);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [wish]);

  // Happy Birthday melody using Web Audio API
  useEffect(() => {
    if (musicEnabled && !audioContextRef.current) {
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const createTone = (
        frequency: number,
        startTime: number,
        duration: number,
        volume = 0.15,
      ) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = "triangle";

        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      // Happy Birthday melody notes
      const melody = [
        { note: 392, time: 0, duration: 0.4 }, // G
        { note: 392, time: 0.4, duration: 0.2 }, // G
        { note: 440, time: 0.6, duration: 0.6 }, // A
        { note: 392, time: 1.2, duration: 0.6 }, // G
        { note: 523, time: 1.8, duration: 0.6 }, // C
        { note: 494, time: 2.4, duration: 1.2 }, // B

        { note: 392, time: 3.6, duration: 0.4 }, // G
        { note: 392, time: 4.0, duration: 0.2 }, // G
        { note: 440, time: 4.2, duration: 0.6 }, // A
        { note: 392, time: 4.8, duration: 0.6 }, // G
        { note: 587, time: 5.4, duration: 0.6 }, // D
        { note: 523, time: 6.0, duration: 1.2 }, // C
      ];

      const playMelody = () => {
        const now = audioContext.currentTime;
        melody.forEach(({ note, time, duration }) => {
          createTone(note, now + time, duration);
        });
      };

      playMelody();
      const interval = setInterval(playMelody, 8000);

      return () => {
        clearInterval(interval);
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
      };
    } else if (!musicEnabled && audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [musicEnabled]);

  // Helper to load an external script and wait for it to be ready
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (document.querySelector(`script[data-src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.setAttribute("data-src", src);
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(s);
    });
  };

  // Renders the card to a canvas using an isolated iframe (no Tailwind/oklch)
  const renderCardToCanvas = async (): Promise<HTMLCanvasElement> => {
    // Step 1: Render DownloadableCard with React in the main document to get its HTML
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "fixed";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "0";
    document.body.appendChild(tempContainer);

    const { createRoot } = await import("react-dom/client");
    const tempRoot = createRoot(tempContainer);

    await new Promise<void>((resolve) => {
      tempRoot.render(
        <DownloadableCard
          userName={userName}
          birthDate={birthDate}
          wish={wish}
          userPhoto={userPhoto}
        />,
      );
      setTimeout(resolve, 1500);
    });

    // Grab the rendered HTML (all inline styles preserved)
    const cardHTML = tempContainer.innerHTML;
    tempRoot.unmount();
    document.body.removeChild(tempContainer);

    // Step 2: Inject the HTML into a clean iframe (no Tailwind CSS = no oklch)
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "1400px";
    iframe.style.height = "700px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) throw new Error("Could not access iframe document");

    iframeDoc.open();
    iframeDoc.write(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { width: 1400px; height: 700px; overflow: hidden; }</style></head><body>${cardHTML}</body></html>`,
    );
    iframeDoc.close();

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Wait for images to load inside the iframe
    const images = iframeDoc.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          setTimeout(() => resolve(), 3000);
        });
      }),
    );

    const cardElement = iframeDoc.body.firstElementChild as HTMLElement;
    if (!cardElement) throw new Error("Card element not found");

    // Use global html2canvas loaded from CDN in index.html; if unavailable, fall back to SVG -> image -> canvas.
    try {
      const html2canvas: any = (window as any).html2canvas || null;

      if (html2canvas) {
        const canvas = await html2canvas(cardElement, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
          allowTaint: false,
          width: 1400,
          height: 700,
          foreignObjectRendering: false,
          imageTimeout: 15000,
        });

        document.body.removeChild(iframe);
        return canvas;
      }

      // Fallback: serialize the card element into an SVG foreignObject and draw it to canvas.
      try {
        const width = 1400;
        const height = 700;

        const serialized =
          '<div xmlns="http://www.w3.org/1999/xhtml">' +
          cardElement.outerHTML +
          "</div>";
        const svg = `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%">${serialized}</foreignObject></svg>`;

        const svgBlob = new Blob([svg], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.crossOrigin = "anonymous";

        const canvas = document.createElement("canvas");
        canvas.width = width * 2;
        canvas.height = height * 2;
        const ctx = canvas.getContext("2d");

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            try {
              if (ctx) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              URL.revokeObjectURL(url);
              resolve();
            } catch (e) {
              reject(e);
            }
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load SVG image for fallback export"));
          };
          img.src = url;
        });

        document.body.removeChild(iframe);
        return canvas;
      } catch (fallbackErr) {
        document.body.removeChild(iframe);
        throw fallbackErr;
      }
    } catch (finalErr) {
      document.body.removeChild(iframe);
      throw finalErr;
    }
  };

  const downloadAsPNG = async () => {
    setDownloading(true);
    try {
      const canvas = await renderCardToCanvas();

      const link = document.createElement("a");
      link.download = `${userName}-Birthday-Card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert(
        `Error creating PNG: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
      );
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsPDF = async () => {
    setDownloading(true);
    try {
      const canvas = await renderCardToCanvas();

      const imgData = canvas.toDataURL("image/png");
      // Use global jspdf loaded from CDN in index.html; if unavailable, open printable image or download PNG.
      try {
        const jsPDF: any =
          (window as any).jspdf || (window as any).jsPDF || null;

        if (jsPDF) {
          const PDFConstructor = jsPDF.jsPDF || jsPDF;
          const pdf = new PDFConstructor({
            orientation: "landscape",
            unit: "mm",
            format: [297, 148.5],
          });

          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();

          pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
          pdf.save(`${userName}-Birthday-Card.pdf`);
        } else {
          const newWin = window.open();
          if (newWin) {
            newWin.document.write(
              `<html><head><title>${userName} - Birthday Card</title></head><body style="margin:0"><img src="${imgData}" style="width:100%;height:auto"/></body></html>`,
            );
            newWin.document.close();
            setTimeout(() => {
              try {
                newWin.focus();
                newWin.print();
              } catch (e) {}
            }, 500);
          } else {
            const link = document.createElement("a");
            link.download = `${userName}-Birthday-Card.png`;
            link.href = imgData;
            link.click();
          }
        }
      } catch (pdfErr) {
        console.error("PDF export error:", pdfErr);
        const link = document.createElement("a");
        link.download = `${userName}-Birthday-Card.png`;
        link.href = imgData;
        link.click();
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        `Error creating PDF: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:py-12 overflow-hidden"
    >
      {/* Fireworks background */}
      <Fireworks />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Main Birthday Card - iOS Glass Style */}
      <div ref={cardRef} className="relative z-10 w-full max-w-4xl">
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[32px] p-6 sm:p-8 md:p-12 shadow-2xl"
        >
          {/* Card Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-3">
              🎉 Happy Birthday! 🎉
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-white/90">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {userName}
              </h2>
              {birthDate && (
                <>
                  <span className="hidden sm:inline text-white/50">•</span>
                  <p className="text-lg sm:text-xl md:text-2xl text-white/80">
                    {birthDate}
                  </p>
                </>
              )}
            </div>
          </motion.div>

          {/* Photo with Birthday Hat */}
          {userPhoto && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="flex justify-center mb-6 sm:mb-8"
            >
              <div className="relative">
                <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden border-4 sm:border-8 border-white/30 shadow-2xl bg-white/5 backdrop-blur-md">
                  <img
                    src={userPhoto}
                    alt="Birthday star"
                    className="w-full h-full object-cover mirror"
                    style={{ transform: "scaleX(-1)" }}
                  />
                </div>
                {/* Birthday hat overlay */}
                <div className="absolute -top-12 sm:-top-16 left-1/2 transform -translate-x-1/2">
                  <motion.svg
                    width="80"
                    height="60"
                    viewBox="0 0 120 100"
                    className="w-16 h-12 sm:w-20 sm:h-16 md:w-24 md:h-20"
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <path
                      d="M 60 10 L 20 80 L 100 80 Z"
                      fill="url(#hatGradient)"
                      stroke="#FFD700"
                      strokeWidth="2"
                    />
                    <ellipse cx="60" cy="80" rx="45" ry="8" fill="#FF1493" />
                    <circle cx="60" cy="10" r="8" fill="#FFD700" />
                    <circle cx="60" cy="10" r="5" fill="#FFA500" />
                    <circle
                      cx="50"
                      cy="40"
                      r="4"
                      fill="#FFD700"
                      opacity="0.8"
                    />
                    <circle
                      cx="70"
                      cy="35"
                      r="4"
                      fill="#FFD700"
                      opacity="0.8"
                    />
                    <circle
                      cx="45"
                      cy="60"
                      r="4"
                      fill="#FFD700"
                      opacity="0.8"
                    />
                    <circle
                      cx="75"
                      cy="55"
                      r="4"
                      fill="#FFD700"
                      opacity="0.8"
                    />
                    <circle
                      cx="60"
                      cy="50"
                      r="4"
                      fill="#FFD700"
                      opacity="0.8"
                    />

                    <defs>
                      <linearGradient
                        id="hatGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#FF69B4" />
                        <stop offset="50%" stopColor="#FF1493" />
                        <stop offset="100%" stopColor="#C71585" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </div>
              </div>
            </motion.div>
          )}

          {/* Wish display with typewriter effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: userPhoto ? 1.3 : 1 }}
            className="bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 md:p-10 mb-6 sm:mb-8"
          >
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white text-center leading-relaxed min-h-[80px] sm:min-h-[120px]">
              "{displayedText}"
              {!typingComplete && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 sm:w-1 h-6 sm:h-8 bg-white ml-1"
                />
              )}
            </p>
          </motion.div>

          {/* Celebration message */}
          {typingComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-3 sm:space-y-4"
            >
              <p className="text-lg sm:text-xl md:text-2xl text-white/90">
                ✨ May all your dreams come true! ✨
              </p>
              <p className="text-base sm:text-lg md:text-xl text-white/70 px-4">
                Wishing you a year filled with joy, love, and endless happiness!
                🎂
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="action-buttons fixed bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-wrap gap-2 sm:gap-3 justify-center px-4 max-w-full"
      >
        <motion.button
          onClick={onMusicToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all shadow-lg border border-white/30 text-sm sm:text-base"
        >
          {musicEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span className="hidden sm:inline">
            {musicEnabled ? "Music On" : "Music Off"}
          </span>
        </motion.button>

        <motion.button
          onClick={downloadAsPNG}
          disabled={downloading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 backdrop-blur-md rounded-full text-white transition-all shadow-lg shadow-blue-500/50 disabled:opacity-50 text-sm sm:text-base"
        >
          <ImageIcon size={18} />
          <span>PNG</span>
        </motion.button>

        <motion.button
          onClick={downloadAsPDF}
          disabled={downloading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 backdrop-blur-md rounded-full text-white transition-all shadow-lg shadow-green-500/50 disabled:opacity-50 text-sm sm:text-base"
        >
          <FileText size={18} />
          <span>PDF</span>
        </motion.button>

        <motion.button
          onClick={onReplay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 backdrop-blur-md rounded-full text-white transition-all shadow-lg shadow-purple-500/50 text-sm sm:text-base"
        >
          <RotateCcw size={18} />
          <span className="hidden sm:inline">Replay</span>
        </motion.button>
      </motion.div>

      {downloading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-8 text-white text-center">
            <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
            <p className="text-lg">Creating your birthday card...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
