import React, { useState } from 'react';

interface LogoProps {
  className?: string; // Additional classes for sizing
  variant?: 'light' | 'dark' | 'brand'; // Styling variant
}

export default function Logo({ className = "w-9 h-9", variant = "brand" }: LogoProps) {
  // We attempt to load "/logo.jpeg" from the public directory.
  // If the user uploads "logo.jpeg" to their project, it will display gracefully.
  // Otherwise, it falls back to our bespoke high-fidelity SVG trace.
  const [hasImageError, setHasImageError] = useState(false);

  if (!hasImageError) {
    return (
      <img
        src="/logo.jpeg"
        alt="RestInCare Logo"
        className={`${className} object-contain rounded-[10px] transition-all duration-300`}
        onError={() => setHasImageError(true)}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Brand color palette (from user's original image):
  // - Background: #242f3d (Deep Navy Blue Slate)
  // - Dove: #FFFFFF (Pure White)
  // - Leaves: #D9BE9B (Elegant Muted Gold/Beige)
  
  const isDarkBg = variant === 'brand' || variant === 'dark';
  const doveColor = isDarkBg ? '#FFFFFF' : '#242F3D';
  const leafColor = '#D9BE9B'; // matching the original warm gold leaf
  const waveColor = isDarkBg ? '#FFFFFF' : '#242F3D';

  return (
    <svg 
      className={`${className} overflow-visible transition-colors duration-300`} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle/rounded rect with precise corner radius if 'brand' */}
      {variant === 'brand' && (
        <rect width="200" height="200" rx="46" fill="#242F3D" />
      )}

      {/* Perfectly scaled and centered group to match the logo proportions exactly */}
      <g transform="translate(14, 18) scale(0.85)">
        
        {/* DOVE BACK WING (Smaller wing, pointing up-right behind) */}
        <path
          d="M 112 79 C 103 44, 85 41, 84 41 C 84 41, 91 58, 103 89 C 105.5 95, 108 97, 110 95 C 111.5 93, 113.2 88, 112 79 Z"
          fill={doveColor}
          opacity="0.9"
        />

        {/* DOVE FRONT WING (Magnificent wing sweeping high to the left) */}
        {/* Made of smooth, clean contours matching the double-lobed leaf-like look */}
        <path
          d="M 103 91 C 80.5 73.5, 60.5 53, 52 41.5 C 50.5 39, 52.5 41.5, 57.5 49 C 68.5 66.5, 87 86, 105.5 96 C 107.5 97, 106.5 94.5, 105 92.5 C 93.5 77, 85 64.5, 82 56 C 81 53, 83.5 55.5, 88 64 C 95.5 78, 102 88.5, 104 90 Z"
          fill={doveColor}
        />

        {/* DOVE BODY, TAIL, CHEST AND HEAD */}
        {/* Head on the right, breast wrapping down and throat ascending elegantly, tail pointing left */}
        <path
          d="M 57 122 C 55 125, 59 123.5, 65 121 C 77 116.5, 89.5 106, 101.5 95 C 107.5 89.5, 115 82.5, 119 75 C 122 70, 126.5 61, 131 59 C 135 57, 137.5 59.5, 137.5 63 C 137.5 67, 133 73.5, 127 82.5 C 117.5 96.5, 106 109, 93 118 C 80 127, 72.5 130.5, 64 131 C 59.5 131.3, 58 127, 57 122 Z"
          fill={doveColor}
        />

        {/* Head Eye (precise matching with minimal dot) */}
        <circle cx="129.5" cy="62.5" r="2.8" fill={variant === 'brand' ? '#242F3D' : '#FFFFFF'} />

        {/* GOLDEN OLIVE BRANCH / LEAVES in the beak */}
        {/* Thin elegant stem */}
        <path
          d="M 132.5 65.5 C 136 67.5, 142 66, 145 61"
          stroke={leafColor}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        
        {/* Leaf 1 (Top gold leaf) */}
        <path
          d="M 134.5 56 C 136.5 48.5, 144.5 45.5, 145 49 C 145.5 52, 140 56.5, 134.5 56 Z"
          fill={leafColor}
        />

        {/* Leaf 2 (Right-pointing gold leaf) */}
        <path
          d="M 144.5 60 C 151.5 59, 154.5 64.5, 151.5 67 C 148.5 69, 145 64.5, 144.5 60 Z"
          fill={leafColor}
        />

        {/* Leaf 3 (Bottom-pointing gold leaf) */}
        <path
          d="M 140.5 64.5 C 145 69.5, 141.5 76.5, 138 74.5 C 135 72.5, 138 67.5, 140.5 64.5 Z"
          fill={leafColor}
        />

        {/* PRECISION FLOWING WAVES (Underneath) */}
        {/* Wave 1 (thick, sweeping, majestic wave that cradles the bird) */}
        <path
          d="M 52.5 125 C 71.5 120, 89.5 131.5, 120.5 123.5 C 142.5 118, 152.5 129, 168.5 125.5"
          stroke={waveColor}
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        
        {/* Wave 2 (thinner supporting wave below) */}
        <path
          d="M 57.5 131.5 C 75.5 126.5, 91.5 137.5, 122.5 129.5 C 141.5 124.5, 149.5 134, 162.5 130.5"
          stroke={waveColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.8"
        />
        
      </g>
    </svg>
  );
}
