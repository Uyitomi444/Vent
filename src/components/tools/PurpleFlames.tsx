import { motion } from 'framer-motion';

export default function PurpleFlames({ isSurging = true }: { isSurging?: boolean }) {
  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none overflow-hidden h-[420px] z-30 flex items-end">
      {/* Underlying atmospheric heat glow */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.2 }}
        animate={{ 
          opacity: isSurging ? [0.6, 0.9, 0.7] : 0,
          scaleY: isSurging ? [0.8, 1.1, 0.9] : 0.2
        }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute inset-0 bg-gradient-to-t from-[#532E60] via-[#8B5CF6]/50 to-transparent blur-xl"
      />

      {/* Roaring Vector Flame SVG */}
      <motion.svg
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
        className="w-full h-full relative z-10"
        initial={{ y: 250, opacity: 0, scaleY: 0.3 }}
        animate={{ 
          y: isSurging ? [0, -15, 0] : 250,
          opacity: isSurging ? 1 : 0,
          scaleY: isSurging ? [1, 1.08, 0.96, 1] : 0.3
        }}
        transition={{
          y: { duration: 0.8, ease: 'easeOut' },
          opacity: { duration: 0.4 },
          scaleY: { duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
        }}
      >
        <defs>
          {/* Flame Gradients matching theme */}
          <linearGradient id="purpleFlameDeep" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#2A0845" stopOpacity="1" />
            <stop offset="50%" stopColor="#4A154B" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#6B21A8" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="purpleFlameMid" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#532E60" stopOpacity="1" />
            <stop offset="40%" stopColor="#7C3AED" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#9333EA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="purpleFlameFore" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="1" />
            <stop offset="35%" stopColor="#A855F7" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#C4B4E2" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#D8B4FE" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="purpleFlameCore" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#C4B4E2" stopOpacity="1" />
            <stop offset="50%" stopColor="#E8DCF8" stopOpacity="0.95" />
            <stop offset="85%" stopColor="#FAF5FF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================= LAYER 1: Deep Background Silhouette Flames ================= */}
        <motion.path
          d="M0,700 L0,500 Q50,460 70,410 Q100,320 130,220 Q150,330 180,380 Q210,290 240,160 Q260,260 280,340 Q310,240 350,90 Q380,210 400,310 Q430,220 460,140 Q490,260 510,320 Q540,180 570,80 Q600,220 630,340 Q660,240 690,150 Q720,280 750,350 Q780,210 820,120 Q850,260 880,360 Q910,290 940,240 Q970,360 1000,480 L1000,700 Z"
          fill="url(#purpleFlameDeep)"
          animate={{
            d: [
              "M0,700 L0,500 Q50,460 70,410 Q100,320 130,220 Q150,330 180,380 Q210,290 240,160 Q260,260 280,340 Q310,240 350,90 Q380,210 400,310 Q430,220 460,140 Q490,260 510,320 Q540,180 570,80 Q600,220 630,340 Q660,240 690,150 Q720,280 750,350 Q780,210 820,120 Q850,260 880,360 Q910,290 940,240 Q970,360 1000,480 L1000,700 Z",
              "M0,700 L0,520 Q50,440 80,390 Q110,300 140,200 Q160,310 190,360 Q220,270 250,140 Q270,240 290,320 Q320,220 360,70 Q390,190 410,290 Q440,200 470,120 Q500,240 520,300 Q550,160 580,60 Q610,200 640,320 Q670,220 700,130 Q730,260 760,330 Q790,190 830,100 Q860,240 890,340 Q920,270 950,220 Q980,340 1000,490 L1000,700 Z",
              "M0,700 L0,500 Q50,460 70,410 Q100,320 130,220 Q150,330 180,380 Q210,290 240,160 Q260,260 280,340 Q310,240 350,90 Q380,210 400,310 Q430,220 460,140 Q490,260 510,320 Q540,180 570,80 Q600,220 630,340 Q660,240 690,150 Q720,280 750,350 Q780,210 820,120 Q850,260 880,360 Q910,290 940,240 Q970,360 1000,480 L1000,700 Z"
            ]
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ================= LAYER 2: Vibrant Mid Purple Flame Tongues ================= */}
        <motion.path
          d="M0,700 L0,540 Q40,490 60,430 Q90,340 110,260 Q130,360 160,400 Q190,310 220,190 Q240,290 270,370 Q300,250 330,140 Q360,260 380,340 Q410,230 440,170 Q470,290 500,350 Q530,190 560,110 Q590,240 620,360 Q650,250 680,170 Q710,300 740,380 Q770,230 800,160 Q830,290 860,390 Q890,310 920,260 Q950,380 1000,520 L1000,700 Z"
          fill="url(#purpleFlameMid)"
          animate={{
            d: [
              "M0,700 L0,540 Q40,490 60,430 Q90,340 110,260 Q130,360 160,400 Q190,310 220,190 Q240,290 270,370 Q300,250 330,140 Q360,260 380,340 Q410,230 440,170 Q470,290 500,350 Q530,190 560,110 Q590,240 620,360 Q650,250 680,170 Q710,300 740,380 Q770,230 800,160 Q830,290 860,390 Q890,310 920,260 Q950,380 1000,520 L1000,700 Z",
              "M0,700 L0,550 Q40,470 70,410 Q100,320 120,240 Q140,340 170,380 Q200,290 230,170 Q250,270 280,350 Q310,230 340,120 Q370,240 390,320 Q420,210 450,150 Q480,270 510,330 Q540,170 570,90 Q600,220 630,340 Q660,230 690,150 Q720,280 750,360 Q780,210 810,140 Q840,270 870,370 Q900,290 930,240 Q960,360 1000,530 L1000,700 Z",
              "M0,700 L0,540 Q40,490 60,430 Q90,340 110,260 Q130,360 160,400 Q190,310 220,190 Q240,290 270,370 Q300,250 330,140 Q360,260 380,340 Q410,230 440,170 Q470,290 500,350 Q530,190 560,110 Q590,240 620,360 Q650,250 680,170 Q710,300 740,380 Q770,230 800,160 Q830,290 860,390 Q890,310 920,260 Q950,380 1000,520 L1000,700 Z"
            ]
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ================= LAYER 3: Foreground Bright Lavender Flames ================= */}
        <motion.path
          d="M0,700 L0,590 Q50,540 80,480 Q110,380 140,310 Q160,420 190,460 Q220,350 250,240 Q280,350 310,430 Q340,300 370,210 Q400,320 430,410 Q460,280 490,200 Q520,320 550,400 Q580,260 610,180 Q640,310 670,410 Q700,290 730,220 Q760,340 790,420 Q820,300 850,230 Q880,360 910,440 Q940,360 970,320 Q985,460 1000,580 L1000,700 Z"
          fill="url(#purpleFlameFore)"
          animate={{
            d: [
              "M0,700 L0,590 Q50,540 80,480 Q110,380 140,310 Q160,420 190,460 Q220,350 250,240 Q280,350 310,430 Q340,300 370,210 Q400,320 430,410 Q460,280 490,200 Q520,320 550,400 Q580,260 610,180 Q640,310 670,410 Q700,290 730,220 Q760,340 790,420 Q820,300 850,230 Q880,360 910,440 Q940,360 970,320 Q985,460 1000,580 L1000,700 Z",
              "M0,700 L0,600 Q50,520 90,460 Q120,360 150,290 Q170,400 200,440 Q230,330 260,220 Q290,330 320,410 Q350,280 380,190 Q410,300 440,390 Q470,260 500,180 Q530,300 560,380 Q590,240 620,160 Q650,290 680,390 Q710,270 740,200 Q770,320 800,400 Q830,280 860,210 Q890,340 920,420 Q950,340 980,300 Q990,440 1000,590 L1000,700 Z",
              "M0,700 L0,590 Q50,540 80,480 Q110,380 140,310 Q160,420 190,460 Q220,350 250,240 Q280,350 310,430 Q340,300 370,210 Q400,320 430,410 Q460,280 490,200 Q520,320 550,400 Q580,260 610,180 Q640,310 670,410 Q700,290 730,220 Q760,340 790,420 Q820,300 850,230 Q880,360 910,440 Q940,360 970,320 Q985,460 1000,580 L1000,700 Z"
            ]
          }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ================= LAYER 4: Radiant White/Lilac Heart Core ================= */}
        <motion.path
          d="M0,700 L0,630 Q60,590 100,530 Q140,430 180,360 Q210,470 240,510 Q280,400 320,300 Q360,430 400,500 Q440,380 480,270 Q520,410 560,480 Q600,340 640,260 Q680,400 720,490 Q760,380 800,310 Q840,450 880,520 Q920,440 960,390 L1000,640 L1000,700 Z"
          fill="url(#purpleFlameCore)"
          filter="url(#purpleGlow)"
          animate={{
            d: [
              "M0,700 L0,630 Q60,590 100,530 Q140,430 180,360 Q210,470 240,510 Q280,400 320,300 Q360,430 400,500 Q440,380 480,270 Q520,410 560,480 Q600,340 640,260 Q680,400 720,490 Q760,380 800,310 Q840,450 880,520 Q920,440 960,390 L1000,640 L1000,700 Z",
              "M0,700 L0,640 Q60,570 110,510 Q150,410 190,340 Q220,450 250,490 Q290,380 330,280 Q370,410 410,480 Q450,360 490,250 Q530,390 570,460 Q610,320 650,240 Q690,380 730,470 Q770,360 810,290 Q850,430 890,500 Q930,420 970,370 L1000,650 L1000,700 Z",
              "M0,700 L0,630 Q60,590 100,530 Q140,430 180,360 Q210,470 240,510 Q280,400 320,300 Q360,430 400,500 Q440,380 480,270 Q520,410 560,480 Q600,340 640,260 Q680,400 720,490 Q760,380 800,310 Q840,450 880,520 Q920,440 960,390 L1000,640 L1000,700 Z"
            ]
          }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ================= LAYER 5: Leaping Detached Flame Sparks ================= */}
        <motion.path
          d="M410,120 Q400,90 415,70 Q425,95 410,120 Z"
          fill="#E8DCF8"
          filter="url(#purpleGlow)"
          animate={{
            y: [-10, -45, -80],
            opacity: [1, 0.8, 0],
            scale: [1, 1.2, 0.4]
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.path
          d="M570,110 Q560,75 580,50 Q590,85 570,110 Z"
          fill="#FAF5FF"
          filter="url(#purpleGlow)"
          animate={{
            y: [-15, -55, -95],
            opacity: [1, 0.9, 0],
            scale: [1, 1.3, 0.3]
          }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
        />
        <motion.path
          d="M750,150 Q740,110 760,85 Q770,120 750,150 Z"
          fill="#D8B4FE"
          filter="url(#purpleGlow)"
          animate={{
            y: [-10, -50, -90],
            opacity: [1, 0.8, 0],
            scale: [1, 1.1, 0.2]
          }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
        />
        <motion.path
          d="M260,180 Q250,140 270,110 Q280,150 260,180 Z"
          fill="#C4B4E2"
          filter="url(#purpleGlow)"
          animate={{
            y: [-10, -40, -75],
            opacity: [1, 0.7, 0],
            scale: [1, 1.1, 0.3]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.45 }}
        />
      </motion.svg>
    </div>
  );
}
