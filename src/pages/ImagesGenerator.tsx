import { useCallback, useEffect, useRef, useState } from 'react';

const FAVICON_SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

const SOCIAL_SIZES = [
  { name: 'og-image.png', width: 1200, height: 630, label: 'Open Graph Image (Facebook)' },
  { name: 'twitter-image.png', width: 1200, height: 600, label: 'Twitter Card Image' },
];

interface FaviconSize {
  name: string;
  size: number;
}

interface SocialSize {
  name: string;
  width: number;
  height: number;
  label: string;
}

const ImagesGenerator = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const socialCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [letter, setLetter] = useState('A');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'favicons' | 'social' | 'htmlCode'>('favicons');
  const [name, setName] = useState('Anna Yudina');
  const [tagline, setTagline] = useState('Software Engineer & Tech Lead');

  const colors = {
    textColor: '#ffffff',
    bgColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white background
    borderColor: '#ffffff',
    gradientStart: '#FF9EB3',
    gradientEnd: '#F5BE62',
  };

  // Generate favicon when component mounts or letter changes
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);

    // Add namespace
    if (!/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.exec(svgString)) {
      svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    // Create data URL
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDownloadUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [letter]);

  // Function to generate a single favicon PNG
  const generateFaviconPNG = async (size: number): Promise<Blob> => {
    if (!svgRef.current) throw new Error('SVG reference not available');

    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);

    // Add namespace
    if (!/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.exec(svgString)) {
      svgString = svgString.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    // Create SVG blob
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create canvas for conversion
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Draw SVG to canvas
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = svgUrl;
    });

    ctx.drawImage(img, 0, 0, size, size);

    // Clean up
    URL.revokeObjectURL(svgUrl);

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Failed to create blob');
        }
      }, 'image/png');
    });
  };

  // Function to download a single favicon
  const downloadFavicon = async (faviconSize: FaviconSize) => {
    try {
      const blob = await generateFaviconPNG(faviconSize.size);
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.download = faviconSize.name;
      downloadLink.href = url;
      downloadLink.click();
      URL.revokeObjectURL(url);
    } catch (error: unknown) {
      console.error(`Error generating ${faviconSize.name}:`, error);
    }
  };

  // Function to download all favicons as a zip
  const downloadAllFavicons = async () => {
    // This requires JSZip library, so we'll just download individual files
    try {
      for (const size of FAVICON_SIZES) {
        await downloadFavicon(size);
      }
    } catch (error: unknown) {
      console.error('Error generating favicons:', error);
    }
  };

  // Function to generate social media preview image
  const generateSocialImage = useCallback(
    (socialSize: SocialSize) => {
      if (!socialCanvasRef.current) return;

      const canvas = socialCanvasRef.current;
      canvas.width = socialSize.width;
      canvas.height = socialSize.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, colors.gradientStart);
      gradient.addColorStop(1, colors.gradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw logo
      const logoSize = Math.min(canvas.height * 0.4, 200);
      const logoX = canvas.width / 2;
      const logoY = canvas.height * 0.38;

      // Draw circle
      ctx.beginPath();
      ctx.arc(logoX, logoY, logoSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = colors.bgColor;
      ctx.fill();
      ctx.strokeStyle = colors.borderColor;
      ctx.lineWidth = logoSize * 0.04;
      ctx.stroke();

      // Draw letter
      ctx.font = `bold ${String(Math.floor(logoSize * 0.7))}px Montserrat, sans-serif`;
      ctx.fillStyle = colors.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letter, logoX, logoY);

      // Draw name
      ctx.font = `${String(Math.floor(canvas.height * 0.1))}px Montserrat, sans-serif`;
      ctx.fillStyle = colors.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, canvas.width / 2, canvas.height * 0.7);

      // Draw tagline
      if (tagline) {
        ctx.font = `${String(Math.floor(canvas.height * 0.05))}px Montserrat, sans-serif`;
        ctx.fillStyle = colors.textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tagline, canvas.width / 2, canvas.height * 0.8);
      }
    },
    [
      letter,
      name,
      tagline,
      colors.bgColor,
      colors.borderColor,
      colors.gradientEnd,
      colors.gradientStart,
      colors.textColor,
    ],
  );

  // Function to download social image
  const downloadSocialImage = (socialSize: SocialSize) => {
    if (!socialCanvasRef.current) return;

    generateSocialImage(socialSize);

    const canvas = socialCanvasRef.current;
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Failed to create blob');
        return;
      }

      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.download = socialSize.name;
      downloadLink.href = url;
      downloadLink.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const generateHtmlCode = () => {
    return `<!-- Favicon links to your HTML <head> section -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- SEO meta tags -->
<meta name="title" content="${name} | ${tagline}">
<meta name="description" content="Portfolio and personal website of ${name}, showcasing creative work and projects.">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${name} | ${tagline}">
<meta property="og:description" content="Portfolio and personal website of ${name}, showcasing creative work and projects.">
<meta property="og:image" content="https://yourdomain.com/og-image.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${name} | ${tagline}">
<meta property="twitter:description" content="Portfolio and personal website of ${name}, showcasing creative work and projects.">
<meta property="twitter:image" content="https://yourdomain.com/twitter-image.png">`;
  };

  const copyHtmlToClipboard = () => {
    navigator.clipboard
      .writeText(generateHtmlCode())
      .then(() => {
        alert('HTML code copied to clipboard!');
      })
      .catch((err: unknown) => {
        console.error('Failed to copy: ', err);
      });
  };

  // Function to update social preview when tab changes
  useEffect(() => {
    if (selectedTab === 'social' && socialCanvasRef.current) {
      generateSocialImage(SOCIAL_SIZES[0]);
    }
  }, [selectedTab, name, tagline, letter, generateSocialImage]);

  return (
    <div className="container mx-auto max-w-5xl p-6 pt-14">
      <h1 className="mb-6">SEO & Favicon Generator</h1>

      <div className="card-theme p-6">
        <div className="mb-6 flex border-b border-black">
          <button
            type="button"
            className={`mr-4 px-3 pt-1 pb-2 ${
              selectedTab === 'favicons' ? 'border-b-2 border-black font-bold' : ''
            }`}
            onClick={() => {
              setSelectedTab('favicons');
            }}
          >
            Favicon Generator
          </button>
          <button
            type="button"
            className={`mr-4 px-3 pt-1 pb-2 ${
              selectedTab === 'social' ? 'border-b-2 border-black font-bold' : ''
            }`}
            onClick={() => {
              setSelectedTab('social');
            }}
          >
            Social Media Images
          </button>
          <button
            type="button"
            className={`mr-4 px-3 pt-1 pb-2 ${
              selectedTab === 'htmlCode' ? 'border-b-2 border-black font-bold' : ''
            }`}
            onClick={() => {
              setSelectedTab('htmlCode');
            }}
          >
            HTML Code
          </button>
        </div>

        {selectedTab === 'favicons' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="mb-4">
                <label className="label-theme">Letter</label>
                <input
                  type="text"
                  className="input-theme"
                  maxLength={1}
                  value={letter}
                  onChange={(e) => {
                    setLetter(e.target.value.charAt(0).toUpperCase());
                  }}
                />
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="btn-theme-outline mb-3 w-full"
                  onClick={() => {
                    void downloadAllFavicons();
                  }}
                >
                  Download All Favicon Sizes
                </button>
              </div>

              <div className="mt-6">
                <h3 className="label-theme mb-2">Individual Sizes</h3>
                <div className="grid grid-cols-2 gap-2">
                  {FAVICON_SIZES.map((size) => (
                    <button
                      type="button"
                      key={size.name}
                      className="btn-theme-outline py-1 text-xs"
                      onClick={() => {
                        void downloadFavicon(size);
                      }}
                    >
                      {size.name} ({size.size}×{size.size})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-6 flex items-center justify-center rounded-xl border border-black bg-white/20 p-6">
                <svg
                  ref={svgRef}
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="30"
                    fill={colors.bgColor}
                    stroke={colors.textColor}
                    strokeWidth="2"
                  />
                  <text
                    x="32"
                    y="32"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={colors.textColor}
                    fontFamily="Montserrat, sans-serif"
                    fontSize="32"
                    fontWeight="bold"
                  >
                    {letter}
                  </text>
                </svg>
              </div>

              {downloadUrl && (
                <div className="text-center">
                  <p className="label-theme mb-2">Preview</p>
                  <div className="inline-block rounded-md border border-black bg-white/20 p-2">
                    <img src={downloadUrl} width="32" height="32" alt="Favicon preview" />
                  </div>
                  <p className="mt-2 text-xs">Actual Size (32×32px)</p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'social' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="mb-4">
                <label className="label-theme">Logo Letter</label>
                <input
                  type="text"
                  className="input-theme"
                  maxLength={1}
                  value={letter}
                  onChange={(e) => {
                    setLetter(e.target.value.charAt(0).toUpperCase());
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="label-theme">Name</label>
                <input
                  type="text"
                  className="input-theme"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="label-theme">Tagline</label>
                <input
                  type="text"
                  className="input-theme"
                  value={tagline}
                  onChange={(e) => {
                    setTagline(e.target.value);
                  }}
                />
              </div>

              <div className="mt-6">
                <h3 className="label-theme mb-2">Download Images</h3>
                <div className="grid grid-cols-1 gap-2">
                  {SOCIAL_SIZES.map((size) => (
                    <button
                      type="button"
                      key={size.name}
                      className="btn-theme-outline py-2 text-sm"
                      onClick={() => {
                        downloadSocialImage(size);
                      }}
                    >
                      {size.label} ({size.width}×{size.height})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-6 flex w-full items-center justify-center rounded-xl border border-black bg-white/20 p-4">
                <canvas
                  ref={socialCanvasRef}
                  className="h-auto w-full max-w-md rounded-md border border-black"
                  style={{ aspectRatio: '1200/630' }}
                />
              </div>
              <p className="text-center text-xs">Preview of Social Media Image (Scaled Down)</p>
            </div>
          </div>
        )}

        {selectedTab === 'htmlCode' && (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <div className="mb-4">
                <label className="label-theme">Name</label>
                <input
                  type="text"
                  className="input-theme"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="label-theme">Tagline</label>
                <input
                  type="text"
                  className="input-theme"
                  value={tagline}
                  onChange={(e) => {
                    setTagline(e.target.value);
                  }}
                />
              </div>

              <div className="mb-2 flex items-center justify-between">
                <h3 className="label-theme">HTML Code</h3>
                <button
                  type="button"
                  className="rounded border border-black bg-white/30 px-2 py-1 text-xs"
                  onClick={copyHtmlToClipboard}
                >
                  Copy HTML
                </button>
              </div>
              <pre className="max-h-80 overflow-x-auto overflow-y-auto rounded-md border border-black bg-white/20 p-3 text-sm">
                {generateHtmlCode()}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesGenerator;
