import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = ({ isHero = false }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isHero 
          ? (scrolled ? "bg-white/20 backdrop-blur-md shadow-md" : "bg-transparent")
          : "bg-white shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-white">
  <span className="text-[#ff7b00]">Stage</span>
          <span className="text-blue-900">Flow</span>
        </Link>
        <div className={`hidden md:flex items-center space-x-6 text-lg ${
          isHero && !scrolled ? "text-white" : "text-gray-800"
        }`}>
          <Link to="/" className="hover:text-orange-700">Accueil</Link>
          <Link to="/offres" className="hover:text-orange-700">Offres</Link>
        </div>
        <div className="hidden md:flex gap-4">
          <Link
            to="/connexion"
            className={`px-4 py-2 border rounded hover:border-orange-700 hover:text-orange-400 transition ${
              isHero && !scrolled 
                ? "border-white text-white" 
                : "border-gray-800 text-gray-800"
            }`}
          >
            Connexion
          </Link>
          <Link
            to="/inscription"
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
          >
            S'inscrire
          </Link>
        </div>
      </div>
      <div className={`h-[1px] ${
        isHero && !scrolled ? "bg-white opacity-20" : "bg-transparent"
      }`}></div>
    </nav>
  );
};

export default Navbar;