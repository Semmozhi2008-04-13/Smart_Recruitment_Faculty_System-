import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import citLogo from '../assets/cit logo.png';

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  // 1. Setup reactive state variable for live date and time tracking
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  // 2. Run a background interval loop that syncs state with system time ticks every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up interval on component unmount to prevent background memory leaks
    return () => clearInterval(timer);
  }, []);

  // 3. Define explicit formatting options for our platform design layouts
  const formattedDateString = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTimeString = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const trimmedSearch = searchTerm.trim();
    if (!trimmedSearch) {
      return;
    }

    const routeMatches = [
      { keywords: ['dashboard', 'home'], path: '/dashboard' },
      { keywords: ['job', 'jobs', 'vacancy', 'role'], path: '/jobs' },
      { keywords: ['candidate', 'candidates', 'applicant'], path: '/candidates' },
      { keywords: ['interview', 'interviews', 'schedule'], path: '/interviews' },
      { keywords: ['evaluation', 'score'], path: '/evaluation' },
      { keywords: ['selection', 'selected'], path: '/selection' },
      { keywords: ['offer', 'offers', 'letter'], path: '/offers' },
    ];

    const normalizedSearch = trimmedSearch.toLowerCase();
    const matchedRoute = routeMatches.find((route) =>
      route.keywords.some((keyword) => normalizedSearch.includes(keyword))
    );

    if (matchedRoute) {
      navigate(matchedRoute.path);
      setSearchTerm('');
      return;
    }

    navigate(`/candidates?search=${encodeURIComponent(trimmedSearch)}`);
  };

  return (
    <header className="flex justify-between items-center w-full px-4 lg:px-8 h-20 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs">
      
      {/* LEFT ZONE: [Hamburger Icon] followed immediately by [Sleek Title] */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* [Hamburger Icon] - Active across desktop and mobile layout rules */}
        <button 
          onClick={toggleSidebar}
          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl shadow-xs transition-all duration-150 active:scale-95 flex items-center justify-center cursor-pointer"
          aria-label="Toggle Navigation Control Suite"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* [Sleek Title] - Premium Accent Branding Pill */}
        <div className="flex items-center gap-2.5 bg-blue-50/70 border border-blue-100/40 px-3.5 py-1.5 rounded-lg select-none">
          <div className="w-5 h-5 overflow-hidden flex items-center justify-start shrink-0">
            <img 
              src={citLogo} 
              alt="CIT emblem" 
              className="h-5 w-auto object-cover max-w-none scale-125 origin-left" 
            />
          </div>
          <span className="text-xs font-bold text-blue-900 uppercase tracking-widest font-sans hidden sm:inline">
            Smart Faculty Recruitment System
          </span>
          <span className="text-xs font-bold text-blue-900 uppercase tracking-widest font-sans inline sm:hidden">
            SFRS
          </span>
        </div>

      </div>

      {/* CENTER ZONE: [Search Bar] centered smoothly in the middle track layout space */}
      <form className="flex-1 max-w-xs md:max-w-sm mx-4" onSubmit={handleSearchSubmit}>
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            search
          </span>
          <input 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50/80 border border-slate-100 rounded-full text-sm placeholder:text-gray-400/90 focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 focus:bg-white transition-all duration-150" 
            placeholder="Search candidates, pages..."
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </form>

      {/* RIGHT ZONE: [Date & Time] followed by the [Profile] Avatar Badge */}
      <div className="flex items-center gap-3 shrink-0 font-mono text-xs md:text-sm tracking-wide">
        
        {/* [Date & Time] Dynamic Live Clock Stamp Pill */}
        <div className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl text-gray-600 font-semibold shadow-xs hidden md:flex items-center gap-2 select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{formattedDateString}</span>
          <span className="text-gray-300 font-light mx-1">|</span>
          <span className="text-indigo-600 font-bold">{formattedTimeString}</span>
        </div>

        {/* [Profile] HR Initials Avatar Indicator Label */}
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 items-center justify-center font-bold text-xs shadow-xs select-none shrink-0 hidden sm:flex">
          HR
        </div>

      </div>

    </header>
  );
}
