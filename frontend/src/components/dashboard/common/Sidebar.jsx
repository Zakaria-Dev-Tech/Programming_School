import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // 1. Import de motion
import { 
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineBookOpen,
  HiOutlineClipboardList,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,

  HiOutlineLogout
} from 'react-icons/hi';
import { GrServices } from "react-icons/gr";
// 2. Définition des variantes pour la cascade
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Délai entre chaque item
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 120 } 
  },
};

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const menuItems = [
    { path: '/admin', name: 'Tableau de bord', icon: HiOutlineHome },
    { path: '/admin/utilisateurs', name: 'Utilisateurs', icon: HiOutlineUsers },
    { path: '/admin/formations', name: 'Formations', icon: HiOutlineBookOpen },
    { path: '/admin/services', name: 'Services', icon: GrServices },
    { path: '/admin/inscriptions', name: 'Inscriptions', icon: HiOutlineClipboardList },
    { path: '/admin/paiements', name: 'Paiements', icon: HiOutlineCreditCard },
    { path: '/admin/logs', name: 'Logs sécurité', icon: HiOutlineShieldCheck },
      { path: '/admin/profil', name: 'Profil', icon: HiOutlineUsers },
   
  ];


  return (
    <>
      {/* Bouton hamburger */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2   rounded-none "
        >
          <HiOutlineMenu className="h-6 w-6 text-gray-600" />
        </button>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:flex-col
      `}>
        {/* En-tête */}
        <div className="flex items-center justify-between p-4 border-b">
          <img 
              src="/assets/logo.png" 
              alt="Programming School Logo" 
              className="h-32 w-auto"
            />
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
              <HiOutlineX className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
        
    

        {/* Menu avec animation  */}
        <motion.nav 
          className="flex-1 mt-6"
          variants={containerVariants}
          initial="hidden"
          animate={sidebarOpen ? "visible" : "hidden"}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div 
                key={item.path} 
                variants={itemVariants}
                whileHover={{ x: 5 }} 
              >
                <Link
                  to={item.path}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 mx-2 mb-1  rounded-lg transition ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 ' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="text-lg font-semibold">{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

       
        <motion.div 
          className="p-4 border-t mt-auto"
          variants={itemVariants}
          initial="hidden"
          animate={sidebarOpen ? "visible" : "hidden"}
        >
          <button onClick={handleLogout} className="flex items-center px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <HiOutlineLogout className="h-5 w-5 mr-3" />
            <span className="text-lg font-semibold">Déconnexion</span>
          </button>
        </motion.div>
      </div>

      {/* mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;