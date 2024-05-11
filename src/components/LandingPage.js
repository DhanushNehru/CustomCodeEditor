import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page">
      <h1>Welcome to Dhanush N Code Editor</h1>
      <Link to="/editor">Editor</Link>
    </div>
  );
}

export default LandingPage;