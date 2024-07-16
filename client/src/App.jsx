import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Signup from './pages/SignupPage';
import Login from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AddEvent from './pages/AddEvent';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Dashboard/>}/>
        <Route path='/add-event' element={<AddEvent/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;