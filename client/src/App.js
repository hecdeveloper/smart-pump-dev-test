import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/edit-profile" element={<EditProfile/>}/>
      </Routes>
    </Router>
  );
}

export default App;
