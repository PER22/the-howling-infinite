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
import EmailVerificationPage from '../EmailVerification/EmailVerificationPage';
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

import CommentModerationPage from '../CommentModeration/CommentModerationPage';

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
              <Route path="/verify-email" element={<EmailVerificationPage/>} />

              <Route path="/" exact element={<HomePage />} />
              
              <Route path="/read" element={<ReadMainEssayPage loggedInUser={loggedInUser}/>} />
              <Route path="/edit" element={<EditMainEssayPage loggedInUser={loggedInUser}/>} />
              
              <Route path="/side-essays" element={<SideEssaysIndexPage loggedInUser={loggedInUser}/>} />
              <Route path="/side-essays/new"  element={<CreateSideEssayPage loggedInUser={loggedInUser}/>} />
              <Route path="/side-essays/:essayId" element={<SideEssayDetailPage loggedInUser={loggedInUser}/>} />
              <Route path="/side-essays/:essayId/edit" element={<EditSideEssayPage loggedInUser={loggedInUser}/>} />
            
              <Route path="/blog" exact element={<AllBlogPostsPage loggedInUser={loggedInUser}/>} />
              <Route path="/blog/new" element={<BlogPostCreatePage loggedInUser={loggedInUser}/>}/>
              <Route path="/blog/:postId/edit" element={<BlogPostEditPage loggedInUser={loggedInUser}/>} />
              <Route path="/blog/:postId" element={<BlogPostDetailPage loggedInUser={loggedInUser} />} />

              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage loggedInUser={loggedInUser}/>} />

              <Route path="/moderate" element={<CommentModerationPage loggedInUser={loggedInUser} />} />
            </Routes>
          </section>
        </TitleProvider>
        <FooterBar></FooterBar>
    </main>
  );
}

