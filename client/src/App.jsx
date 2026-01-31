import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './components/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import ForgotPassword from './pages/ForgotPassWord';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Footer from './components/Footer';
import MostrarItem from './pages/MostrarItem';
import Contact from './components/Contact';
import Equipa from './components/Equipa';
import Terms from './components/Terms';

export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/team' element={<Equipa/>}/>
        <Route path='/terms' element={<Terms/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/mostrar-item' element={<MostrarItem/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/listing/:listingId' element={<Listing/>}/>
        <Route element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}/> 
          <Route path='/create-listing' element={<CreateListing/>}/> 
          <Route 

            path='/update-listing/:listingId' 
            element={<UpdateListing/>}/> 
        </Route>
      </Routes>
      {/* <Footer/> */}

      <Footer/>

    </BrowserRouter>
  );
}
