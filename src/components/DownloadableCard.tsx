
interface DownloadableCardProps {
  userName: string;
  birthDate: string;
  wish: string;
  userPhoto: string;
}

export function DownloadableCard({ userName, birthDate, wish, userPhoto }: DownloadableCardProps) {
  return (
    <div 
      style={{
        width: '1400px',
        height: '700px',
        margin: '0',
        padding: '0',
        background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 50%, #3B82F6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        fontSize: '24px',
      }}>🎈</div>
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '8%',
        fontSize: '20px',
      }}>⭐</div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '10%',
        fontSize: '20px',
      }}>💖</div>
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '5%',
        fontSize: '24px',
      }}>⭐</div>
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '15%',
        fontSize: '20px',
      }}>🎉</div>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '15%',
        fontSize: '18px',
      }}>💖</div>
      <div style={{
        position: 'absolute',
        bottom: '35%',
        left: '8%',
        fontSize: '16px',
      }}>⭐</div>
      <div style={{
        position: 'absolute',
        top: '70%',
        right: '12%',
        fontSize: '18px',
      }}>💖</div>

      {/* Main card container - Simplified for html2canvas compatibility */}
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        background: 'rgba(255, 255, 255, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '32px',
        padding: '48px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
      }}>
        {/* Card Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.02em',
            }}>
              🎉 Happy Birthday!
            </h1>
            <h2 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#fbbf24',
              margin: 0,
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            }}>
              {userName}
            </h2>
            {birthDate && (
              <>
                <span style={{ fontSize: '32px', color: 'rgba(255, 255, 255, 0.5)' }}>•</span>
                <p style={{
                  fontSize: '32px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                }}>
                  {birthDate}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Photo with Birthday Hat */}
        {userPhoto && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '32px',
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '6px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                background: 'rgba(255, 255, 255, 0.1)',
              }}>
                <img
                  src={userPhoto}
                  alt="Birthday star"
                  {...(!userPhoto.startsWith('data:') ? { crossOrigin: 'anonymous' as const } : {})}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)',
                  }}
                />
              </div>
              {/* Birthday hat overlay */}
              <div style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}>
                <svg
                  width="70"
                  height="55"
                  viewBox="0 0 120 100"
                  style={{ width: '70px', height: '55px' }}
                >
                  <defs>
                    <linearGradient id="hatGradientExport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#FF69B4" />
                      <stop offset="0.5" stopColor="#FF1493" />
                      <stop offset="1" stopColor="#C71585" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 60 10 L 20 80 L 100 80 Z"
                    fill="url(#hatGradientExport)"
                    stroke="#FFD700"
                    strokeWidth="2"
                  />
                  <ellipse cx="60" cy="80" rx="45" ry="8" fill="#FF1493" />
                  <circle cx="60" cy="10" r="8" fill="#FFD700" />
                  <circle cx="60" cy="10" r="5" fill="#FFA500" />
                  <circle cx="50" cy="40" r="4" fill="#FFD700" opacity="0.8" />
                  <circle cx="70" cy="35" r="4" fill="#FFD700" opacity="0.8" />
                  <circle cx="45" cy="60" r="4" fill="#FFD700" opacity="0.8" />
                  <circle cx="75" cy="55" r="4" fill="#FFD700" opacity="0.8" />
                  <circle cx="60" cy="50" r="4" fill="#FFD700" opacity="0.8" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Wish display */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '32px',
        }}>
          <p style={{
            fontSize: '24px',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: '1.6',
            margin: 0,
          }}>
            "{wish}"
          </p>
        </div>

        {/* Celebration message */}
        <div style={{
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0 0 8px 0',
          }}>
            ✨ May all your dreams come true! ✨
          </p>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: 0,
          }}>
            Wishing you a year filled with joy, love, and endless happiness! 🎂
          </p>
        </div>
      </div>
    </div>
  );
}
