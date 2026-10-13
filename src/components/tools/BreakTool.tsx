import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Coffee, Film, ChevronLeft, ChevronRight, Sparkles, Check, Clapperboard } from 'lucide-react';

const BREAK_ACRONYM = [
  { letter: 'B', title: 'reathe', desc: 'Take 5 deep, slow breaths.' },
  { letter: 'R', title: 'est', desc: 'Close your eyes until your mind is clear.' },
  { letter: 'E', title: 'mpowering words', desc: 'Say 3 nice things about yourself.' },
  { letter: 'A', title: 'bsorb', desc: 'Check in with your senses. What do you see, feel, hear?' },
  { letter: 'K', title: 'nowledge', desc: 'Stop and think before you act.' },
];

const ACTIVITIES = [
  "Start a Mini Garden 🪴",
  "Go on a Nature Walk 🚶‍♂️",
  "Do a Jigsaw Puzzle or Boardgames 🧩",
  "Watch a Sunrise or Sunset 🌅",
  "Camp in a Public Park with Friends or Family 🏕️",
  "Beach Day or Nature Escape 🏖",
  "Try a Pottery Class or Clay Sculpting 🏺",
  "Cloud Watching ☁️",
  "Try Birdwatching 🐦",
  "Go Fishing 🎣",
  "Go for a Morning Jog in the Fresh Air 🏃",
  "Press Flowers or Leaves 🌸",
  "Plan a Picnic 🧺",
  "Try Outdoor Sketching or Painting 🎨",
  "Visit a Garden or Nursery 🌻",
  "Outdoor Yoga 🧘‍♀️",
  "Watch a Feel-Good Movie 🎬"
];

interface FeelGoodMovie {
  id: string;
  title: string;
  cover: string;
  category: 'cozy' | 'fall' | 'inspiring' | 'animation';
  vibe: string;
  blurb: string;
}

const FEEL_GOOD_MOVIES: FeelGoodMovie[] = [
  {
    id: 'the-holiday',
    title: 'The Holiday',
    cover: '/movies/the-holiday.jpg',
    category: 'cozy',
    vibe: 'Comfort & Warmth',
    blurb: 'Two women swap homes for the holidays and find gentle romance, warmth, and peace in snowy England and sunny LA.'
  },
  {
    id: 'when-harry-met-sally',
    title: 'When Harry Met Sally',
    cover: '/movies/when-harry-met-sally.jpg',
    category: 'cozy',
    vibe: 'Autumn Classic',
    blurb: 'Witty, charming, and filled with golden Central Park foliage as lifelong friends slowly realize they are meant for each other.'
  },
  {
    id: 'the-intern',
    title: 'The Intern',
    cover: '/movies/the-intern.jpg',
    category: 'cozy',
    vibe: 'Gentle & Uplifting',
    blurb: 'A 70-year-old widower becomes a senior intern, bringing calm wisdom, kindness, and genuine mentorship to a young founder.'
  },
  {
    id: 'fantastic-mr-fox',
    title: 'Fantastic Mr. Fox',
    cover: '/movies/fantastic-mr-fox.jpg',
    category: 'fall',
    vibe: 'Whimsical & Golden',
    blurb: 'Wes Anderson’s autumnal stop-motion masterpiece filled with witty banter, warm cider hues, and pure family solidarity.'
  },
  {
    id: 'little-women',
    title: 'Little Women',
    cover: '/movies/little-women.jpg',
    category: 'fall',
    vibe: 'Nostalgic & Tender',
    blurb: 'A radiant, heartwarming celebration of sisterhood, creative dreams, and cozy candlelit winter nights with the March family.'
  },
  {
    id: 'good-will-hunting',
    title: 'Good Will Hunting',
    cover: '/movies/good-will-hunting.jpg',
    category: 'inspiring',
    vibe: 'Deeply Moving',
    blurb: 'A poignant and uplifting journey of vulnerability, mentorship, and letting down walls to discover who you truly are.'
  },
  {
    id: 'about-time',
    title: 'About Time',
    cover: '/movies/about-time.jpg',
    category: 'cozy',
    vibe: 'Life-Affirming',
    blurb: 'A tender, deeply touching story about loving your family, savoring everyday moments, and finding grace in ordinary days.'
  },
  {
    id: 'youve-got-mail',
    title: "You've Got Mail",
    cover: '/movies/youve-got-mail.jpg',
    category: 'cozy',
    vibe: 'Bookshop Comfort',
    blurb: 'Crisp autumn in New York, independent children’s bookshops, warm coffee, and charming anonymous letters across 90s screens.'
  },
  {
    id: 'julie-and-julia',
    title: 'Julie & Julia',
    cover: '/movies/julie-and-julia.jpg',
    category: 'cozy',
    vibe: 'Comfort Food',
    blurb: 'Rich French cooking, hot butter, and the soothing joy of throwing your heart into recipes when life feels overwhelming.'
  },
  {
    id: 'dead-poets-society',
    title: 'Dead Poets Society',
    cover: '/movies/dead-poets-society.jpg',
    category: 'inspiring',
    vibe: 'Poetic & Heartfelt',
    blurb: 'Robin Williams inspires his students to look at the world from new perspectives and seize the beauty in everyday life.'
  },
  {
    id: 'pride-and-prejudice',
    title: 'Pride & Prejudice',
    cover: '/movies/pride-and-prejudice.jpg',
    category: 'cozy',
    vibe: 'Period Serenity',
    blurb: 'Sweeping piano melodies, lush mist-covered meadows, and the timeless slow-burn comfort of Elizabeth and Mr. Darcy.'
  },
  {
    id: 'knives-out',
    title: 'Knives Out',
    cover: '/movies/knives-out.jpg',
    category: 'fall',
    vibe: 'Cozy Mystery',
    blurb: 'Cable-knit sweaters, autumn rain, hot cider, and an utterly delightful, witty country-mansion whodunit.'
  },
  {
    id: 'harry-potter',
    title: "Harry Potter & Sorcerer's Stone",
    cover: '/movies/harry-potter.jpg',
    category: 'fall',
    vibe: 'Pure Magic',
    blurb: 'Floating candles, roaring common-room hearths, feasts in the Great Hall, and the comforting feeling of arriving home.'
  },
  {
    id: 'ferris-bueller',
    title: "Ferris Bueller's Day Off",
    cover: '/movies/ferris-bueller.jpg',
    category: 'inspiring',
    vibe: 'Carefree & Joyful',
    blurb: 'A sunlit Chicago day reminding you that “Life moves pretty fast. If you don’t stop and look around once in a while, you could miss it.”'
  },
  {
    id: 'walter-mitty',
    title: 'The Secret Life of Walter Mitty',
    cover: '/movies/walter-mitty.jpg',
    category: 'inspiring',
    vibe: 'Awe & Wanderlust',
    blurb: 'From quiet daydreams to skateboarding down Icelandic mountains and Himalayan peaks — pure cinematic peace and wonder.'
  },
  {
    id: 'moana',
    title: 'Moana',
    cover: '/movies/moana.jpg',
    category: 'animation',
    vibe: 'Sunny & Uplifting',
    blurb: 'Soaring ocean breezes, uplifting music, courage, and the heartwarming journey across shimmering turquoise waters.'
  },
  {
    id: 'tangled',
    title: 'Tangled',
    cover: '/movies/tangled.jpg',
    category: 'animation',
    vibe: 'Bright & Magical',
    blurb: 'Floating lantern skies, spirited humor, memorable songs, and stepping out into the world to see your dream come true.'
  },
  {
    id: 'zootopia',
    title: 'Zootopia',
    cover: '/movies/zootopia.jpg',
    category: 'animation',
    vibe: 'Playful & Optimistic',
    blurb: 'A bustling, vibrant world of animals filled with humor, friendship, determination, and never giving up on your goals.'
  },
  {
    id: 'the-parent-trap',
    title: 'The Parent Trap',
    cover: '/movies/the-parent-trap.jpg',
    category: 'animation',
    vibe: '90s Nostalgia',
    blurb: 'Oreos with peanut butter, summer camp cabins, vineyard breezes, and mischievous twin schemes in pure 90s comfort.'
  },
  {
    id: 'midnight-in-paris',
    title: 'Midnight in Paris',
    cover: '/movies/midnight-in-paris.jpg',
    category: 'cozy',
    vibe: 'Magical Escape',
    blurb: 'Midnight strolls through cobblestone Parisian streets in the rain, antique jazz, and meeting legendary artists in a golden daydream.'
  },
  {
    id: 'brooklyn',
    title: 'Brooklyn',
    cover: '/movies/brooklyn.jpg',
    category: 'cozy',
    vibe: 'Tender & Beautiful',
    blurb: 'A quiet, deeply empathetic story about finding home, kind neighbors, gentle love, and growing into your true inner strength.'
  },
  {
    id: 'a-good-year',
    title: 'A Good Year',
    cover: '/movies/a-good-year.jpg',
    category: 'cozy',
    vibe: 'Sun-Drenched Escape',
    blurb: 'Slowing down from the frantic city rush to savor golden vineyards, lavender fields, and leisurely lunches in Provence.'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Picks' },
  { id: 'cozy', label: 'Cozy & Romance' },
  { id: 'fall', label: 'Fall Vibes' },
  { id: 'inspiring', label: 'Inspiring' },
  { id: 'animation', label: 'Wholesome & Animated' },
] as const;

export default function BreakTool({ onClose }: { onClose: () => void }) {
  const [activity, setActivity] = useState<string | null>(null);
  const [showMovies, setShowMovies] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cozy' | 'fall' | 'inspiring' | 'animation'>('all');
  const [activeMovie, setActiveMovie] = useState<FeelGoodMovie | null>(FEEL_GOOD_MOVIES[0]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const suggestActivity = () => {
    const nextIndex = Math.floor(Math.random() * ACTIVITIES.length);
    const chosen = ACTIVITIES[nextIndex];
    setActivity(chosen);
    if (chosen === "Watch a Feel-Good Movie 🎬") {
      setShowMovies(true);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const pickRandomMovie = () => {
    const pool = selectedCategory === 'all' 
      ? FEEL_GOOD_MOVIES 
      : FEEL_GOOD_MOVIES.filter(m => m.category === selectedCategory);
    const random = pool[Math.floor(Math.random() * pool.length)];
    setActiveMovie(random);
  };

  const filteredMovies = selectedCategory === 'all'
    ? FEEL_GOOD_MOVIES
    : FEEL_GOOD_MOVIES.filter(m => m.category === selectedCategory);

  const isMovieActivity = activity === "Watch a Feel-Good Movie 🎬";

  return (
    <div className="bg-[#532E60] border-2 border-white/40 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 md:p-10 shadow-2xl text-white relative overflow-x-hidden overflow-y-visible flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/20 pb-3 sm:pb-4 mb-4 sm:mb-6 gap-2">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#613B6E] text-white rounded-full font-black text-[10px] sm:text-xs hover:bg-[#3D2048] transition-colors border border-white/30 cursor-pointer shadow-sm flex-shrink-0"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <span className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-[#613B6E] text-[#E8DCF8] rounded-full text-[10px] sm:text-xs font-black border border-white/20 flex-shrink-0">
          Mindful Rest
        </span>
      </div>

      <div className="text-center mb-5 sm:mb-8">
        <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-black text-white mb-1.5">Take a Mindful Break</h3>
        <p className="text-[#E8DCF8] text-xs sm:text-sm font-bold">Disconnect and rest your mind away from the noise.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start relative z-10 mb-4 sm:mb-6">
        
        {/* Left side: Acronym */}
        <div className="space-y-3 sm:space-y-4 bg-[#613B6E]/40 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-white/10">
          <h4 className="font-black text-white mb-4 border-b border-white/20 pb-2 flex items-center justify-between">
            <span>The B.R.E.A.K. Method</span>
            <span className="text-xs text-[#E8DCF8] font-medium">5 Slow Steps</span>
          </h4>
          {BREAK_ACRONYM.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col"
            >
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-[#C4B4E2]">{item.letter}</span>
                <h5 className="text-lg font-black text-white tracking-wide">{item.title}</h5>
              </div>
              <p className="text-sm text-[#E8DCF8] font-bold ml-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Right side: Activities Generator */}
        <div className="bg-[#613B6E] p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-center min-h-[240px] sm:min-h-[280px] border border-white/20 shadow-inner">
          <div className="w-12 h-12 bg-[#532E60] rounded-full flex items-center justify-center mb-4 border border-[#C4B4E2] shadow-md">
            {isMovieActivity ? (
              <Clapperboard className="w-6 h-6 text-[#C4B4E2]" />
            ) : (
              <Coffee className="w-6 h-6 text-[#C4B4E2]" />
            )}
          </div>
          <h4 className="font-black text-white mb-2">Need an activity?</h4>
          <p className="text-sm text-[#E8DCF8] font-bold mb-5">Let's find something relaxing to recharge your energy.</p>
          
          <AnimatePresence mode="wait">
            {activity && (
              <motion.div
                key={activity}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#532E60] px-4 py-3 rounded-xl shadow-md mb-4 w-full border border-[#C4B4E2]"
              >
                <span className="font-black text-[#C4B4E2] text-base">{activity}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
            <button
              onClick={suggestActivity}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#C4B4E2] text-[#532E60] rounded-full font-black text-sm hover:bg-white transition-colors shadow-xl w-full justify-center cursor-pointer border border-white"
            >
              <RotateCcw className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{activity ? 'Give me another idea' : 'Suggest an Activity'}</span>
            </button>

            <button
              onClick={() => {
                setShowMovies(!showMovies);
                if (!showMovies && !activity) {
                  setActivity("Watch a Feel-Good Movie 🎬");
                }
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#532E60]/80 text-[#E8DCF8] hover:text-white rounded-full font-black text-[11px] sm:text-xs hover:bg-[#3D2048] transition-colors border border-white/20 w-full justify-center cursor-pointer"
            >
              <Film className="w-3.5 h-3.5 text-[#C4B4E2] flex-shrink-0" />
              <span className="truncate">{showMovies ? 'Hide Movies' : 'Browse Feel-Good Movies 🍿'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Feel-Good Movie Recommendations Section */}
      <AnimatePresence>
        {(showMovies || isMovieActivity) && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 15 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="border-t border-white/20 pt-4 sm:pt-6 mt-2 relative z-10"
          >
            {/* Header & Controls */}
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-[#C4B4E2] text-[#532E60] text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Feel-Good Picks
                </span>
                <span className="text-[10px] sm:text-xs text-[#E8DCF8] font-bold">Scroll through comfort films</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-base sm:text-xl font-serif font-black text-white">Suggested Movies</h4>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={pickRandomMovie}
                    className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-[#613B6E] text-white hover:bg-[#3D2048] border border-white/20 rounded-full text-[10px] sm:text-xs font-black transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-[#C4B4E2]" />
                    <span>Pick For Me</span>
                  </button>
                  <div className="hidden sm:flex items-center gap-1 bg-[#613B6E] p-1 rounded-full border border-white/20">
                    <button
                      onClick={scrollLeft}
                      aria-label="Scroll movies left"
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-[#532E60] transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={scrollRight}
                      aria-label="Scroll movies right"
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-[#532E60] transition-colors cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-3 sm:mb-4 scrollbar-none -mx-1 px-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-[#C4B4E2] text-[#532E60] border-white shadow-md'
                      : 'bg-[#613B6E]/70 text-[#E8DCF8] border-white/15 hover:bg-[#613B6E] hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Horizontal Movie Carousel */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-2.5 sm:gap-4 overflow-x-auto pb-3 sm:pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-white/20 scroll-smooth touch-pan-x -mx-1 px-1"
            >
              {filteredMovies.map(movie => {
                const isSelected = activeMovie?.id === movie.id;
                return (
                  <motion.div
                    key={movie.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveMovie(movie)}
                    className={`flex-shrink-0 w-28 sm:w-36 md:w-40 snap-start bg-[#613B6E] rounded-xl sm:rounded-2xl p-2 sm:p-2.5 cursor-pointer border transition-all text-left group shadow-lg ${
                      isSelected
                        ? 'border-[#C4B4E2] ring-2 ring-[#C4B4E2] bg-[#613B6E]'
                        : 'border-white/20 hover:border-white/50'
                    }`}
                  >
                    <div className="relative aspect-[2/3] w-full rounded-lg sm:rounded-xl overflow-hidden bg-[#532E60] mb-1.5 sm:mb-2.5 shadow-md">
                      <img
                        src={movie.cover}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#532E60] text-[#C4B4E2] border border-[#C4B4E2] flex items-center justify-center shadow-md">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                      )}
                      <div className="absolute bottom-1 left-1 right-1 sm:bottom-1.5 sm:left-1.5 sm:right-1.5">
                        <span className="px-1.5 sm:px-2 py-0.5 bg-[#532E60]/90 backdrop-blur-sm text-[#E8DCF8] text-[8px] sm:text-[9px] font-black rounded-md border border-white/20 block truncate">
                          {movie.vibe}
                        </span>
                      </div>
                    </div>

                    <h5 className="font-black text-white text-[10px] sm:text-xs leading-snug truncate" title={movie.title}>
                      {movie.title}
                    </h5>
                  </motion.div>
                );
              })}
            </div>

            {/* Selected Movie Spotlight Card */}
            {activeMovie && (
              <motion.div
                key={activeMovie.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 sm:mt-4 bg-[#613B6E]/90 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border border-[#C4B4E2]/40 flex flex-row gap-3 sm:gap-4 items-start"
              >
                <img
                  src={activeMovie.cover}
                  alt={activeMovie.title}
                  className="w-14 h-20 sm:w-20 sm:h-28 object-cover rounded-lg sm:rounded-xl shadow-lg border border-white/30 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                    <h5 className="text-sm sm:text-lg font-serif font-black text-white truncate">{activeMovie.title}</h5>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-[#532E60] text-[#C4B4E2] border border-white/20 text-[9px] sm:text-[10px] font-black flex-shrink-0">
                      {activeMovie.vibe}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-sm text-[#E8DCF8] font-medium leading-relaxed mb-2 sm:mb-3 line-clamp-3 sm:line-clamp-none">
                    {activeMovie.blurb}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#C4B4E2] font-bold flex flex-wrap items-start gap-1">
                    <span className="flex-shrink-0">☕ Tip:</span>
                    <span className="text-white/90">Grab a blanket & silence notifications.</span>
                  </p>
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3D2048]/30 pointer-events-none rounded-[2.5rem]" />
    </div>
  );
}
