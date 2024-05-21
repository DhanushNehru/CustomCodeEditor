import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EditorComponent from './pages/EditorComponent';
import './components/css/App.css'

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
