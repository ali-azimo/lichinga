import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaWhatsapp, 
  FaEnvelope, 
  FaPhone, 
  FaArrowUp,
  FaFacebook,
  FaInstagram
} from 'react-icons/fa';

export default function Footer() {
  const [email, setEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      alert('Obrigado pela sua inscrição!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <FaArrowUp />
      </button>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <FaHome className="text-xl text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Easy<span className="text-blue-400">-Home</span>
                </h2>
                <p className="text-xs text-gray-400">Lichinga, Niassa</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Encontre o lar perfeito em Lichinga. Conectamos você às melhores propriedades da região.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com/easyhomelichinga" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a 
                href="https://instagram.com/easyhomelichinga" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a 
                href="https://wa.me/258844314455" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Início</Link></li>
              <li><Link to="/search" className="text-gray-400 hover:text-white transition-colors">Buscar</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Sobre</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Propriedades</h3>
            <ul className="space-y-2">
              <li><Link to="/search?type=casa" className="text-gray-400 hover:text-white transition-colors">Casas</Link></li>
              <li><Link to="/search?type=apartamento" className="text-gray-400 hover:text-white transition-colors">Apartamentos</Link></li>
              <li><Link to="/search?type=terreno" className="text-gray-400 hover:text-white transition-colors">Terrenos</Link></li>
              <li><Link to="/search?type=machamba" className="text-gray-400 hover:text-white transition-colors">Machambas</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-400" />
                <a href="tel:+258844314455" className="text-gray-400 hover:text-white transition-colors">
                  +258 84 431 4455
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaWhatsapp className="text-green-400" />
                <a href="https://wa.me/258844314455" className="text-gray-400 hover:text-white transition-colors">
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-red-400" />
                <a href="mailto:niassa-house@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  niassa-house@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-bold mb-4">Receba Novidades</h3>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <div className="text-gray-400 text-sm mb-2">
            © {currentYear} Easy-Home. Todos os direitos reservados.
          </div>
          <div className="flex justify-center gap-4 text-sm">
            <Link to="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
              Termos
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
              Privacidade
            </Link>
            <Link to="/contact" className="text-gray-500 hover:text-gray-300 transition-colors">
              Ajuda
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}