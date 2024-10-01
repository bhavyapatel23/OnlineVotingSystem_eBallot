
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './components/Home';
import CreatePoll from './components/CreatePoll'
import Admin from './components/Admin'
import User from './components/User'
import Result from './components/Result';
import Login from './components/login';
import Landingpage from './components/Landingpage';
import 'bootstrap/dist/css/bootstrap.min.css'
import { CookiesProvider } from 'react-cookie';
import Register from './components/Register';
import ConditionalLayout from './components/ConditionalLayout';
import PartyForm from "./components/PartyForm";


function App() {
 
  

  return (
    <CookiesProvider>
      <BrowserRouter>
       

        <ConditionalLayout>
          <Routes>

            <Route path='/' element={<Landingpage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/home' element={<Home />} />
            <Route path="createpoll" element={<CreatePoll />} />
            <Route path="admin/editpoll" element={<CreatePoll />} />
            <Route path="admin" element={<Admin />} />
            <Route path="user" element={<User />} />
            <Route path="result" element={<Result />} />
            <Route path='admin/addparty' element={<PartyForm/>}/>
            <Route path='admin/editparty' element={<PartyForm/>}/>
            


          </Routes>
        </ConditionalLayout>
      </BrowserRouter>
    </CookiesProvider>



  );
}

export default App;
