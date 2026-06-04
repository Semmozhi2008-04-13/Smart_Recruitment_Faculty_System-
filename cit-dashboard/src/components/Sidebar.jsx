import { NavLink } from 'react-router-dom';
import citLogo from '../assets/cit logo.png';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navItemBase = "flex items-center gap-3.5 px-5 py-3 rounded-r-full transition-all duration-200 text-sm font-medium";
  
  const getNavClass = (isActive) => 
    `${navItemBase} ${isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-500 hover:text-gray-900 hover:bg-slate-50'}`;

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Dim Mobile Backdrop Mask Layer */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity duration-300 backdrop-blur-xs" 
          onClick={closeSidebar}
        />
      )}

      {/* Primary Navigation Container Drawer */}
      <aside className={`
        fixed left-0 top-0 h-full flex flex-col pb-6 z-50 bg-white border-r border-slate-100 w-[240px]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Brand Logo Header Container Box */}
        <div className="h-24 flex items-center justify-between lg:justify-center px-5 border-b border-slate-100/80 mb-6 shrink-0">
          <a 
            href="https://www.citchennai.edu.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-85 transition-opacity w-full flex justify-center px-1"
            title="Visit Official CIT Website"
          >
            <img 
              src={citLogo} 
              alt="Chennai Institute of Technology" 
              className="h-14 w-full object-contain select-none" 
            />
          </a>

          {/* Mobile Dismiss Close Drawer Button */}
          <button 
            onClick={closeSidebar}
            className="lg:hidden p-1.5 text-gray-400 hover:bg-slate-100 rounded-lg transition-colors ml-2"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Navigation Map Router Links */}
        <nav className="flex-grow flex flex-col gap-1 overflow-y-auto pr-3" onClick={handleNavClick}>
          <NavLink to="/dashboard" className={({ isActive }) => getNavClass(isActive)}>
            <span className="material-symbols-outlined text-[22px]">dashboard</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/jobs" className={({ isActive }) => getNavClass(isActive)}>
            <span className="material-symbols-outlined text-[22px]">work</span>
            <span>Job Management</span>
          </NavLink>

          <NavLink to="/candidates" className={({ isActive }) => getNavClass(isActive)}>
            <span className="material-symbols-outlined text-[22px]">group</span>
            <span>Candidates</span>
          </NavLink>

          <NavLink to="/interviews" className={({ isActive }) => getNavClass(isActive)}>
            {({ isActive }) => (
              <>
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  calendar_today
                </span>
                <span>Interviews</span>
              </>
            )}
          </NavLink>

          <NavLink to="/evaluation" className={({ isActive }) => getNavClass(isActive)}>
            {({ isActive }) => (
              <>
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  rate_review
                </span>
                <span>Evaluation</span>
              </>
            )}
          </NavLink>

          <NavLink to="/selection" className={({ isActive }) => getNavClass(isActive)}>
            {({ isActive }) => (
              <>
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  check_box
                </span>
                <span>Selection</span>
              </>
            )}
          </NavLink>

          <NavLink to="/offers" className={({ isActive }) => getNavClass(isActive)}>
            {({ isActive }) => (
              <>
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  description
                </span>
                <span>Offers</span>
              </>
            )}
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
