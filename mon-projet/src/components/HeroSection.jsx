import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Image de fond - absolute (pas fixed) */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-75 z-0"
        style={{ backgroundImage: "url('/assets/imagehero.jpg')" }}
      ></div>

      {/* Contenu cliquable */}
      <div className="relative z-10 h-full">
        {/* Navbar - avec pointer-events-auto */}
        <nav
          className={`fixed top-0 w-full z-10 transition-all duration-500 pointer-events-auto ${
            scrolled ? "bg-white/20 backdrop-blur-md shadow-md" : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-3xl font-bold text-white">
              <span className="text-orange-700">Stage</span>
              <span className="text-blue-900">Flow</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6 text-white text-lg">
              <Link to="/" className="hover:text-orange-700">Accueil</Link>
              <Link to="/offres" className="hover:text-orange-700">Offres</Link>
            </div>
            <div className="hidden md:flex gap-4">
              <Link
                to="/connexion"
                className="px-4 py-2 border border-white text-white rounded hover:border-orange-700 hover:text-orange-400 transition"
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
          <div className="h-[1px] bg-white opacity-20"></div>
        </nav>

        {/* Contenu Hero */}
        <div className="h-screen flex items-center px-6 md:px-20 pt-16">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight space-y-4 mb-10">
              <div>CHERCHEZ</div>
              <div>
                TROUVEZ <span className="text-orange-700">&</span>
              </div>
              <div className="text-orange-700">POSTULEZ</div>
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Des centaines d'offres de stage vous attendent.
            </p>
            <Link
              to="/offres"
              className="inline-block px-6 py-3 bg-orange-700 text-white text-lg rounded hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Voir les offres
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;