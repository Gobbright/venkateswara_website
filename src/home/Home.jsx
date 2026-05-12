import React from 'react';
import Hero from './Hero.jsx';
import Offers from './Offers.jsx';
import Trust from './Trust.jsx';
import Categories from './Categories.jsx';
import Trending from './Trending.jsx';
import BrandBand from './BrandBand.jsx';
import Collection from './Collection.jsx';
import ShopEnquiry from './ShopEnquiry.jsx';

const Home = () => {
  return (
    <div className="">
      <Hero />
      <Categories />
      <Trending />
      {/* <BrandBand /> */}
      <Collection />
      <Offers />
      <Trust />
      <ShopEnquiry />
    </div>
  );
};

export default Home;
