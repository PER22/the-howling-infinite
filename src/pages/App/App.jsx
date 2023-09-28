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
import RequestPasswordResetPage from '../Authentication/RequestPasswordReset/RequestPasswordResetPage';
import PerformPasswordResetPage from '../Authentication/PerformPasswordResetPage/PerformPasswordResetPage';
  //Home
import HomePage from '../Home/HomePage';

  //Main Essay
import ReadMainEssayPage from '../MainEssay/ReadMainEssayPage';
import EditMainEssayPage from '../MainEssay/EditMainEssayPage';

  //Side Essays
import SideEssaysIndexPage from '../SideEssays/SideEssaysIndexPage';
import SideEssayDetailPage from '../SideEssays/SideEssayDetailPage';
import CreateSideEssayPage from '../SideEssays/CreateSideEssayPage';
import EditSideEssayPage from '../SideEssays/EditSideEssayPage';
  
  //Blog
import AllBlogPostsPage from '../Blog/AllBlogPosts/AllBlogPostsPage';
import BlogPostCreatePage from '../Blog/BlogPostCreate/BlogPostCreatePage';
import BlogPostEditPage from '../Blog/BlogPostEdit/BlogPostEditPage';
import BlogPostDetailPage from '../Blog/BlogPostDetail/BlogPostDetailPage';
  
import AboutPage from '../About/AboutPage';

import ContactPage from '../Contact/ContactPage';

//Components
// import NavigationBar from '../../components/NavigationBar/NavigationBar';
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import FooterBar from '../../components/FooterBar/FooterBar'
import TitleBar from '../../components/TitleBar/TitleBar';
import { TitleProvider } from '../../components/TitleBar/TitleContext';



export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(getLoggedInUser());
  return (
    <main className="App">
        <ResponsiveDrawer setUser={setLoggedInUser} user={loggedInUser} sx={{position: 'fixed'}}/>
        <TitleProvider>
          <TitleBar/>
          <section className='content'>
            <Routes>  
              <Route path="/auth" exact element={<AuthPage setUser={setLoggedInUser}/>}/>
              <Route path="/request-password-reset" exact element={<RequestPasswordResetPage />}/>
              <Route path="/reset-password" exact element={<PerformPasswordResetPage />}/>
              
              <Route path="/" exact element={<HomePage />} />
              
              <Route path="/read" element={<ReadMainEssayPage />} />
              <Route path="/edit" element={<EditMainEssayPage />} />
              
              <Route path="/side-essays" element={<SideEssaysIndexPage />} />
              <Route path="/side-essays/create"  element={<CreateSideEssayPage />} />
              <Route path="/side-essays/:essayId" element={<SideEssayDetailPage />} />
              <Route path="/side-essays/:essayId/edit" element={<EditSideEssayPage />} />
            
              <Route path="/blog" exact element={<AllBlogPostsPage />} />
              <Route path="/blog/new" element={<BlogPostCreatePage />}/>
              <Route path="/blog/:postId/edit" element={<BlogPostEditPage />} />
              <Route path="/blog/:postId" element={<BlogPostDetailPage loggedInUser={loggedInUser} />} />

              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </section>
        </TitleProvider>
        <FooterBar></FooterBar>
    </main>
  );
}

