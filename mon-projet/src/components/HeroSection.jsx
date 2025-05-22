import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-75 z-0"
        style={{ backgroundImage: "url('/assets/a (3).jpg')" }}
      ></div>

      {/* Contenu cliquable */}
      <div className="relative z-10 h-full">
        <Navbar isHero={true} />

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