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

  //Home
import HomePage from '../Home/HomePage';

  //Main Essay
import ReadMainEssayPage from '../MainEssay/ReadMainEssayPage';
import EditMainEssayPage from '../MainEssay/EditMainEssayPage';


import SideEssaysIndexPage from '../SideEssays/SideEssaysIndexPage';
import SideEssayDetailPage from '../SideEssays/SideEssayDetailPage';
import BlogPage from '../Blog/BlogPage';
import AboutPage from '../About/AboutPage';
import ContactPage from '../Contact/ContactPage';


//Components
// import NavigationBar from '../../components/NavigationBar/NavigationBar';
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import FooterBar from '../../components/FooterBar/FooterBar'
import EditSideEssayPage from '../SideEssays/EditSideEssayPage';

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
            <Route path="/read" element={<ReadMainEssayPage/>} />
            <Route path="/edit" element={<EditMainEssayPage/>} />
            <Route path="/side-essays" element={<SideEssaysIndexPage/>} />
            <Route path="/side-essays/:essayId" element={<SideEssayDetailPage/>} />
            <Route path="/side-essays/create" element={<EditSideEssayPage/>} />
            <Route path="/blog" element={<BlogPage/>} />
            <Route path="/about" element={<AboutPage/>} />
            <Route path="/contact" element={<ContactPage/>} />
          </Routes>
        </section>
        <FooterBar></FooterBar>
    </main>
  );
}

