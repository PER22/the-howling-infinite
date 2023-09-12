//REACT imports
import React, { useState} from 'react';
import { Routes, Route} from 'react-router-dom';

//Utility imports
import { getLoggedInUser } from '../../utilities/users-service';

//CSS
import './App.css';

//Pages
  //Auth
import AuthPage from '../Authentication/AuthPage/AuthPage'
import HomePage from '../Home/HomePage';
import MainPaperPage from '../MainPaper/MainPaperPage';
import SideEssaysPage from '../SideEssays/SideEssaysPage';
import BlogPage from '../Blog/BlogPage';
import AboutPage from '../About/AboutPage';
import ContactPage from '../Contact/ContactPage';


//Components
// import NavigationBar from '../../components/NavigationBar/NavigationBar';
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import FooterBar from '../../components/FooterBar/FooterBar'


export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(getLoggedInUser());
  return (
    <main className="App">
        {/* <NavigationBar setUser={setLoggedInUser} user={loggedInUser} /> */}
        <ResponsiveDrawer setUser={setLoggedInUser} user={loggedInUser}/>
        <section className='content'>
          <Routes>
            <Route path="/auth" exact element={<AuthPage setUser={setLoggedInUser}/>}/>
            <Route path="/" exact element={<HomePage/>} />
            <Route path="/read" element={<MainPaperPage/>} />
            <Route path="/side-essays" element={<SideEssaysPage/>} />
            <Route path="/blog" element={<BlogPage/>} />
            <Route path="/about" element={<AboutPage/>} />
            <Route path="/contact" element={<ContactPage/>} />
          </Routes>
        </section>
        <FooterBar></FooterBar>
    </main>
  );
}

