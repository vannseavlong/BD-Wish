import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, RotateCcw, Check } from 'lucide-react';

interface CameraCaptureProps {
  userName: string;
  onPhotoTaken: (photoDataUrl: string) => void;
}

export function CameraCapture({ userName, onPhotoTaken }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string>('');
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraError(false);
    } catch (err) {
      console.log('Camera access denied or not available');
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the mirrored video
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        // Draw the birthday hat overlay
        const hatWidth = canvas.width * 0.35;
        const hatHeight = hatWidth * 0.8;
        const hatX = canvas.width / 2 - hatWidth / 2;
        const hatY = -hatHeight * 0.3;

        // Create SVG and draw it on canvas
        const svgString = `
          <svg width="${hatWidth}" height="${hatHeight}" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FF69B4" />
                <stop offset="50%" stop-color="#FF1493" />
                <stop offset="100%" stop-color="#C71585" />
              </linearGradient>
            </defs>
            <path d="M 60 10 L 20 80 L 100 80 Z" fill="url(#hatGrad)" stroke="#FFD700" stroke-width="2"/>
            <ellipse cx="60" cy="80" rx="45" ry="8" fill="#FF1493"/>
            <circle cx="60" cy="10" r="8" fill="#FFD700"/>
            <circle cx="60" cy="10" r="5" fill="#FFA500"/>
            <circle cx="50" cy="40" r="4" fill="#FFD700" opacity="0.8"/>
            <circle cx="70" cy="35" r="4" fill="#FFD700" opacity="0.8"/>
            <circle cx="45" cy="60" r="4" fill="#FFD700" opacity="0.8"/>
            <circle cx="75" cy="55" r="4" fill="#FFD700" opacity="0.8"/>
            <circle cx="60" cy="50" r="4" fill="#FFD700" opacity="0.8"/>
          </svg>
        `;

        const img = new Image();
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        img.onload = () => {
          ctx.drawImage(img, hatX, hatY, hatWidth, hatHeight);
          URL.revokeObjectURL(url);
          
          const photoDataUrl = canvas.toDataURL('image/png');
          setCapturedPhoto(photoDataUrl);
          setPhotoTaken(true);
        };
        
        img.src = url;
      }
    }
  };

  const retakePhoto = () => {
    setPhotoTaken(false);
    setCapturedPhoto('');
  };

  const confirmPhoto = () => {
    stopCamera();
    onPhotoTaken(capturedPhoto);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen px-4 py-8"
    >
      {/* Title */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
          Smile, {userName}! 📸
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white/80 px-4">
          Let's capture your special moment with a birthday hat!
        </p>
      </motion.div>

      {/* Camera view or captured photo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative mb-6 sm:mb-8"
      >
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl border-4 border-white/30 shadow-2xl">
          {cameraError ? (
            <div className="flex items-center justify-center h-full text-white text-center p-6 sm:p-8">
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <Camera size={64} className="mx-auto mb-4 opacity-50" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">No Camera Access</h3>
                <p className="text-sm sm:text-base text-white/80 mb-1">
                  No worries! You can continue without a photo.
                </p>
                <p className="text-xs sm:text-sm text-white/60 mb-6">
                  Your birthday card will still be beautiful! ✨
                </p>
                <motion.button
                  onClick={() => onPhotoTaken('')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full text-white text-base sm:text-lg font-bold shadow-lg shadow-purple-500/50 hover:shadow-2xl transition-all"
                >
                  Continue to Celebration 🎉
                </motion.button>
              </div>
            </div>
          ) : (
            <>
              {!photoTaken ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <img
                  src={capturedPhoto}
                  alt="Captured"
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
              )}

              {/* Birthday hat overlay */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 sm:-translate-y-8 z-10">
                <BirthdayHat />
              </div>
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </motion.div>

      {/* Action buttons */}
      {!cameraError && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-3 sm:gap-4"
        >
          <div className="flex gap-3 sm:gap-4">
            {!photoTaken ? (
              <motion.button
                onClick={capturePhoto}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full text-white text-base sm:text-lg font-bold shadow-lg shadow-purple-500/50 hover:shadow-2xl transition-all"
              >
                <Camera size={20} className="sm:w-6 sm:h-6" />
                <span>Capture Photo</span>
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={retakePhoto}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all text-sm sm:text-base"
                >
                  <RotateCcw size={18} className="sm:w-5 sm:h-5" />
                  <span>Retake</span>
                </motion.button>

                <motion.button
                  onClick={confirmPhoto}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white text-base sm:text-lg font-bold shadow-lg shadow-green-500/50 hover:shadow-2xl transition-all"
                >
                  <Check size={20} className="sm:w-6 sm:h-6" />
                  <span>Perfect!</span>
                </motion.button>
              </>
            )}
          </div>
          
          {!photoTaken && (
            <motion.button
              onClick={() => {
                stopCamera();
                onPhotoTaken('');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white/60 hover:text-white/90 underline text-xs sm:text-sm transition-all"
            >
              Skip photo and continue
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Birthday Hat Component
function BirthdayHat() {
  return (
    <motion.svg
      width="120"
      height="100"
      viewBox="0 0 120 100"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
    >
      {/* Hat cone */}
      <path
        d="M 60 10 L 20 80 L 100 80 Z"
        fill="url(#hatGradient)"
        stroke="#FFD700"
        strokeWidth="2"
      />
      {/* Hat brim */}
      <ellipse cx="60" cy="80" rx="45" ry="8" fill="#FF1493" />
      {/* Pom-pom */}
      <circle cx="60" cy="10" r="8" fill="#FFD700" />
      <circle cx="60" cy="10" r="5" fill="#FFA500" />
      {/* Polka dots */}
      <circle cx="50" cy="40" r="4" fill="#FFD700" opacity="0.8" />
      <circle cx="70" cy="35" r="4" fill="#FFD700" opacity="0.8" />
      <circle cx="45" cy="60" r="4" fill="#FFD700" opacity="0.8" />
      <circle cx="75" cy="55" r="4" fill="#FFD700" opacity="0.8" />
      <circle cx="60" cy="50" r="4" fill="#FFD700" opacity="0.8" />
      
      <defs>
        <linearGradient id="hatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF69B4" />
          <stop offset="50%" stopColor="#FF1493" />
          <stop offset="100%" stopColor="#C71585" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}