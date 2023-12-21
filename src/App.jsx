import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages';
import { Add } from './pages/Add';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/add-data" element={<Add />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
