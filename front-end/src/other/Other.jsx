import React from 'react';
import { Link } from 'react-router-dom';

const Other = () => {
  return (
    <div>
      <h1>Other Page</h1>
      <p>Other sections: About, Tailoring, Contact</p>
      <ul>
        <li><Link to="/other/about">About</Link></li>
        <li><Link to="/other/tailoring">Tailoring</Link></li>
        <li><Link to="/other/contact">Contact</Link></li>
      </ul>
    </div>
  );
};

export default Other;