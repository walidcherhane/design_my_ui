import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AddPosts from "./pages/AddPosts";
import Posts from "./pages/Posts";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EmailVerification from "./pages/EmailVerification";

import NavBar from "./components/NavBar";

import { PostsPorvider } from "./contexts/PostsContext";
import { AuthProvider } from "./contexts/authContext";
import { ThemeProvider } from "./contexts/ThemeContext";


import { CookiesProvider } from "react-cookie";
import { HelmetProvider } from "react-helmet-async";

import Public from "./auth/PublicRoute";
import Private from "./auth/PrivateRoute";
import ReactGA from 'react-ga';
import { useEffect } from "react";
function App() {
  const TRACKING_ID = process.env.REACT_APP_TRACKING_ID
  if (!TRACKING_ID) throw new Error("Missing tracking id");
  ReactGA.initialize(TRACKING_ID);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <CookiesProvider>
            <PostsPorvider>
              <HelmetProvider>
                <Router>
                  <NavBar />
                  <Routes>
                    <Route exact path="/" element={<Private />}>
                      {["/","/posts"].map((path, index) => <Route exact path={path} element={<Posts />} key={index}/>)}
                      <Route exact path="/posts/new" element={<AddPosts />} />
                      <Route exact path="/posts/:id" element={<Post />} />
                      <Route exact path="/:username/profile" element={<Profile />} />
                      <Route exact path="/verify/:token" element={<EmailVerification />}/>
                    </Route>
                    <Route exact path="/" element={<Public />}>
                      <Route exact path="/login" element={<Login />} />
                      <Route exact path="/register" element={<Register />} />
                    </Route>
                  </Routes>
                </Router>
              </HelmetProvider>
            </PostsPorvider>
          </CookiesProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
