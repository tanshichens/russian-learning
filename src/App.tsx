import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Words from './pages/Words';
import Listening from './pages/Listening';
import Downloads from './pages/Downloads';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/words" element={<Words />} />
          <Route path="/listening" element={<Listening />} />
          <Route path="/downloads" element={<Downloads />} />
        </Routes>
        <footer>
          <p>© 2025 俄语学习网站</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
