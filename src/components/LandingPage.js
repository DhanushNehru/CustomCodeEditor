import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page">
      <h1>Welcome</h1>
      <Link to="/editor"> Click Here To Navigate To Editor </Link>
    </div>
  );
}

export default LandingPage;