//REACT imports
import React from 'react';

import { Routes, Route } from 'react-router-dom';


//CSS
import './App.css';

//Pages
//Auth
import AuthPage from '../Authentication/AuthPage/AuthPage'
import RequestPasswordResetPage from '../Authentication/RequestPasswordReset/RequestPasswordResetPage';
import PerformPasswordResetPage from '../Authentication/PerformPasswordResetPage/PerformPasswordResetPage';
import EmailVerificationPage from '../EmailVerification/EmailVerificationPage';
import AwaitingVerificationPage from '../EmailVerification/AwaitingVerificationPage';
//Home
import HomePage from '../Home/HomePage';

//Main Essay
import ReadMainEssayPage from '../MainEssay/ReadMainEssayPage';
import EditMainEssayPage from '../MainEssay/EditMainEssayPage';

//Side Essays
// import SideEssaysIndexPage from '../SideEssays/SideEssaysIndexPage';
// import SideEssayDetailPage from '../SideEssays/SideEssayDetailPage';
// import CreateSideEssayPage from '../SideEssays/CreateSideEssayPage';
// import EditSideEssayPage from '../SideEssays/EditSideEssayPage';

//Blog
// import AllBlogPostsPage from '../Blog/AllBlogPosts/AllBlogPostsPage';
// import BlogPostCreatePage from '../Blog/BlogPostCreate/BlogPostCreatePage';
// import BlogPostEditPage from '../Blog/BlogPostEdit/BlogPostEditPage';
// import BlogPostDetailPage from '../Blog/BlogPostDetail/BlogPostDetailPage';

import DiscussionPage from '../Discussion/DiscussionPage'

import AboutPage from '../About/AboutPage';

import ContactPage from '../Contact/ContactPage';

import CommentModerationPage from '../CommentModeration/CommentModerationPage';

//Components
// import NavigationBar from '../../components/NavigationBar/NavigationBar';
import ResponsiveDrawer from '../../components/ResponsiveDrawer/ResponsiveDrawer'
import FooterBar from '../../components/FooterBar/FooterBar'
import TitleBar from '../../components/TitleBar/TitleBar';
import { TitleProvider } from '../../components/TitleBar/TitleContext';
import { LoggedInUserProvider } from '../../components/LoggedInUserContext/LoggedInUserContext';


export default function App() {
  return (
    <main className="App">
      <LoggedInUserProvider>
        <ResponsiveDrawer sx={{ position: 'fixed' }} />
        <TitleProvider>
          <TitleBar />
          <section className='content'>
            <Routes>
              <Route path="/auth" exact element={<AuthPage />} />
              <Route path="/request-password-reset" exact element={<RequestPasswordResetPage />} />
              <Route path="/reset-password" exact element={<PerformPasswordResetPage />} />
              <Route path="/verify-email" element={<EmailVerificationPage />} />
              <Route path="/verification-notice" element={<AwaitingVerificationPage />} />

              <Route path="/" exact element={<HomePage />} />

              <Route path="/read" element={<ReadMainEssayPage />} />
              <Route path="/edit" element={<EditMainEssayPage />} />

              {/* <Route path="/side-essays" element={<SideEssaysIndexPage />} />
              <Route path="/side-essays/new"  element={<CreateSideEssayPage />} />
              <Route path="/side-essays/:essayId" element={<SideEssayDetailPage />} />
              <Route path="/side-essays/:essayId/edit" element={<EditSideEssayPage />} /> */}

              {/* <Route path="/blog" exact element={<AllBlogPostsPage />} />
              <Route path="/blog/new" element={<BlogPostCreatePage />}/>
              <Route path="/blog/:postId/edit" element={<BlogPostEditPage />} />
              <Route path="/blog/:postId" element={<BlogPostDetailPage  />} /> */}

              <Route path="/discuss" element={<DiscussionPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route path="/moderate" element={<CommentModerationPage />} />
            </Routes>
          </section>
        </TitleProvider>
      </LoggedInUserProvider>
      <FooterBar></FooterBar>
    </main>
  );
}

