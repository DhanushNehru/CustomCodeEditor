import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import EditorComponent from './components/EditorComponent'; 

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={<EditorComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App