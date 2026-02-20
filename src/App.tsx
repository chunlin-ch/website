import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import BlogList from './BlogList';
import BlogPost from './BlogPost';
import Travel from './Travel';
import TravelLocation from './TravelLocation';
import TravelAdmin from './TravelAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/travel/admin" element={<TravelAdmin />} />
        <Route path="/travel/:locationId" element={<TravelLocation />} />
      </Routes>
    </Router>
  );
}

export default App;
