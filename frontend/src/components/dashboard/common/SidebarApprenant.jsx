import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HiOutlineMenu,  HiOutlineBookOpen,
  HiOutlineUser, HiOutlineLogout, HiChevronRight
} from 'react-icons/hi';
import { useAuth } from '../../../contexts/AuthContext';
const SidebarApprenant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { setUserData } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setUserData({ name: user.name || user.username || "Apprenant" });
        } catch (e) { console.error(e); }
      }
    };
    syncUser();

    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  },[setUserData]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const menuItems = [
    { path: '/apprenant', name: 'Mes formations', icon: HiOutlineBookOpen },
    { path: '/apprenant/profil', name: 'Mon profil', icon: HiOutlineUser },
  ];

  return (
    <>
     {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4  z-50 p-4   rounded-none "
        >
          <HiOutlineMenu className="h-6 w-6 text-gray-600" />
        </button>
      )}

      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-100 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:flex-col
      `}>
        
        {/* Logo Section */}
        <div className="px-8 py-10 flex flex-col items-center border-b border-slate-50">
          <img src="/assets/logo.png" alt="Logo" className="h-20 w-auto mb-4" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-600 font-bold">Espace Apprenant</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsOpen(false)}
                className={`flex items-center justify-between px-5 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 '
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium tracking-tight">{item.name}</span>
                </div>
                {isActive && <HiChevronRight className="h-4 w-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6">
          <button 
            onClick={handleLogout}
            className="flex items-center px-5 py-4 w-full rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-[11px] font-semibold uppercase tracking-widest"
          >
            <HiOutlineLogout className="h-4 w-4 mr-3" />
            Se déconnecter
          </button>
        </div>
      </div>

      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
};

export default SidebarApprenant;