import React, { useState, useEffect } from 'react';
import { 
  FaBars, 
  FaTimes, 
  FaSearch, 
  FaUser, 
  FaSignOutAlt, 
  FaHome,
  FaHeart,
  FaChartBar,
  FaCog,
  FaQuestionCircle,
  FaPlus,
  FaBuilding,
  FaPhone,
  FaUsers,
  FaBalanceScale
} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure 
} from '../redux/user/userSlice';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { currentUser, loading } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu') && !event.target.closest('.user-avatar')) {
        setUserOpen(false);
      }
      if (!event.target.closest('.search-container')) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    const params = new URLSearchParams();
    params.set('searchTerm', searchTerm);
    navigate(`/search?${params}`);
    setSearchTerm('');
    setSearchOpen(false);
    setNavOpen(false);
  };

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      
      dispatch(signOutUserSuccess());
      localStorage.removeItem('token');
      setUserOpen(false);
      setNavOpen(false);
      navigate('/sign-in');
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const menuItems = [
    { route: '/search', label: 'Explorar', icon: <FaSearch className="text-lg" /> },
    { route: '/about', label: 'Sobre', icon: <FaBuilding className="text-lg" /> },
    { route: '/team', label: 'Equipe', icon: <FaUsers className="text-lg" /> },
    { route: '/contact', label: 'Contacto', icon: <FaPhone className="text-lg" /> },
    { route: '/terms', label: 'Termos', icon: <FaBalanceScale className="text-lg" /> },

  ];

  const userMenuItems = currentUser ? [
    { route: '/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { route: '/mostrar-item', label: 'Meus Anúncios', icon: <FaHome /> },
    { route: '/create-listing', label: 'Criar Anúncio', icon: <FaPlus /> },
    { route: '/favorites', label: 'Favoritos', icon: <FaHeart /> },
    { route: '/settings', label: 'Definições', icon: <FaCog /> },
    { route: '/help', label: 'Ajuda', icon: <FaQuestionCircle /> },
    { type: 'divider' },
    { type: 'signout', label: 'Sair', icon: <FaSignOutAlt /> }
  ] : [];

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  EH
                </span>
              </div>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Easy-Home</h1>
              <p className="text-xs text-blue-200">Encontre seu lar perfeito</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-1">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.route}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
                  ${location.pathname === item.route 
                    ? 'bg-white/20 text-white' 
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Search Bar Desktop */}
          <div className="relative search-container flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Pesquisar propriedades..."
                className="w-full px-4 py-2 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white/20 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => setSearchOpen(true)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200" />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 p-1.5 rounded-md hover:bg-blue-50 transition-colors"
                disabled={!searchTerm.trim()}
              >
                <FaSearch className="text-sm" />
              </motion.button>
            </form>

            {/* Search Suggestions */}
            <AnimatePresence>
              {searchOpen && searchTerm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl overflow-hidden z-40"
                >
                  <div className="p-3 border-b">
                    <p className="text-sm font-medium text-gray-700">Sugestões para "{searchTerm}"</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {['Casa em Lichinga', 'Apartamento Centro', 'Terreno Machamba'].map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchTerm(suggestion);
                          setSearchOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu Desktop */}
          <div className="relative user-menu">
            {currentUser ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors user-avatar"
                  disabled={loading}
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar || '/default-avatar.png'}
                      alt="Perfil"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{currentUser.username}</p>
                    <p className="text-xs text-blue-200">{currentUser.role || 'Usuário'}</p>
                  </div>
                  {loading && (
                    <div className="ml-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                </motion.button>

                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100"
                    >
                      {/* User Info */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-white border-b">
                        <div className="flex items-center space-x-3">
                          <img
                            src={currentUser.avatar || '/default-avatar.png'}
                            alt="Perfil"
                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                          />
                          <div>
                            <p className="font-bold text-gray-800">{currentUser.username}</p>
                            <p className="text-xs text-gray-600 truncate">{currentUser.email}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                              {currentUser.role || 'Usuário'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {userMenuItems.map((item, idx) => {
                          if (item.type === 'divider') {
                            return <div key={idx} className="border-t border-gray-100 my-2" />;
                          }
                          
                          if (item.type === 'signout') {
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setUserOpen(false);
                                  handleSignout();
                                }}
                                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                                disabled={loading}
                              >
                                <span className="mr-3">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                                {loading && (
                                  <div className="ml-auto">
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
                                  </div>
                                )}
                              </button>
                            );
                          }

                          return (
                            <Link
                              key={idx}
                              to={item.route}
                              onClick={() => setUserOpen(false)}
                              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            >
                              <span className="mr-3 text-gray-400">{item.icon}</span>
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/sign-in"
                  className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-blue-600 transition-colors font-medium"
                >
                  Entrar
                </Link>
                <Link
                  to="/sign-up"
                  className="px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between">
          <button
            onClick={() => setNavOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Abrir menu"
          >
            <FaBars size={24} />
          </button>

          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">EH</span>
            </div>
            <div>
              <h1 className="font-bold">Easy-Home</h1>
            </div>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Buscar"
            >
              <FaSearch size={20} />
            </button>

            <div className="relative user-menu">
              {currentUser ? (
                <div
                  onClick={() => setUserOpen(!userOpen)}
                  className="cursor-pointer p-1"
                >
                  <img
                    src={currentUser.avatar || '/default-avatar.png'}
                    alt="Perfil"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                </div>
              ) : (
                <Link
                  to="/sign-in"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FaUser size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (when opened) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-blue-700 border-t border-blue-500/30"
          >
            <form onSubmit={handleSearch} className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar propriedades..."
                  className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 p-2 rounded-md"
                  disabled={!searchTerm.trim()}
                >
                  <FaSearch />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-0 bg-gradient-to-b from-blue-600 to-blue-700 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-blue-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">EH</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold">Easy-Home</h1>
                    <p className="text-xs text-blue-200">Encontre seu lar perfeito</p>
                  </div>
                </div>
                <button
                  onClick={() => setNavOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Fechar menu"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            {/* User Info */}
            {currentUser && (
              <div className="p-4 border-b border-blue-500/30">
                <div className="flex items-center space-x-3">
                  <img
                    src={currentUser.avatar || '/default-avatar.png'}
                    alt="Perfil"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div>
                    <p className="font-bold">{currentUser.username}</p>
                    <p className="text-sm text-blue-200">{currentUser.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {menuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.route}
                    onClick={() => setNavOpen(false)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                      ${location.pathname === item.route 
                        ? 'bg-white/20 text-white' 
                        : 'text-blue-100 hover:bg-white/10'
                      }
                    `}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}

                {/* User Specific Menu Items */}
                {currentUser && (
                  <>
                    <div className="pt-4 mt-4 border-t border-blue-500/30">
                      <p className="px-4 py-2 text-xs text-blue-300 uppercase font-semibold">Minha Conta</p>
                      {userMenuItems
                        .filter(item => item.type !== 'signout' && item.type !== 'divider')
                        .map((item, idx) => (
                          <Link
                            key={idx}
                            to={item.route}
                            onClick={() => setNavOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-white/10 transition-colors"
                          >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        ))}
                    </div>

                    {/* Sign Out */}
                    <button
                      onClick={() => {
                        setNavOpen(false);
                        handleSignout();
                      }}
                      disabled={loading}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/10 transition-colors mt-4"
                    >
                      <FaSignOutAlt />
                      <span className="font-medium">Sair da Conta</span>
                      {loading && (
                        <div className="ml-auto">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-300"></div>
                        </div>
                      )}
                    </button>
                  </>
                )}
              </div>
            </nav>

            {/* Auth Buttons (if not logged in) */}
            {!currentUser && (
              <div className="p-4 border-t border-blue-500/30 space-y-3">
                <Link
                  to="/sign-in"
                  onClick={() => setNavOpen(false)}
                  className="block w-full text-center py-3 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium"
                >
                  Entrar
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setNavOpen(false)}
                  className="block w-full text-center py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile User Menu Dropdown */}
      <AnimatePresence>
        {userOpen && currentUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden fixed right-4 top-16 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100"
          >
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser.avatar || '/default-avatar.png'}
                  alt="Perfil"
                  className="w-10 h-10 rounded-full border-2 border-blue-200"
                />
                <div>
                  <p className="font-bold text-gray-800">{currentUser.username}</p>
                  <p className="text-xs text-gray-600">{currentUser.email}</p>
                </div>
              </div>
            </div>

            <div className="py-2">
              {userMenuItems
                .filter(item => item.type !== 'divider')
                .map((item, idx) => {
                  if (item.type === 'signout') {
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setUserOpen(false);
                          handleSignout();
                        }}
                        disabled={loading}
                        className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                        {loading && (
                          <div className="ml-auto">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600"></div>
                          </div>
                        )}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={idx}
                      to={item.route}
                      onClick={() => setUserOpen(false)}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <span className="mr-3 text-gray-400">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}