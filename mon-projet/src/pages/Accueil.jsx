
import React from 'react';
import HeroSection from '../components/HeroSection';
import QuiSommesNous from '../components/QuiSommesNous';
import PourquoiNousChoisir from '../components/PourquoiNousChoisir';
import CommentCaMarche from '../components/CommentCaMarche';

function Accueil() {
  return (
    <>
      <HeroSection />
      <QuiSommesNous />
      <PourquoiNousChoisir />
      <CommentCaMarche />
    </>
  );
}

export default Accueil;
