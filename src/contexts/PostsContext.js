import { message } from "antd";
import React, { useContext, createContext, useState, useEffect } from "react";
import { getLikedPosts, getSavedPosts } from "../api";
import { useAuth } from "./authContext";
  
  const PostsContext = createContext();
  export function usePosts() {
    return useContext(PostsContext);
  }
  
  
  export function PostsPorvider({ children }) {
    const {currentUser} = useAuth()
    const [posts, setPosts] = useState([])
    const [savedPosts, setSavedPosts] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    
    
    useEffect(() => {
      if(!currentUser) return;
      const getInitialikes = async () =>{
        try {
          const { data } = await getLikedPosts()
          console.log(data)
          setLikedPosts(data.likedPosts)
        } catch (error) {
          message.warning('Error happed while fetching likes')
        }        
      }
      const getInitialSavedPosts = async ()=>{
        try {
          const {data} = await getSavedPosts(currentUser.username);
          console.log(data)
          setSavedPosts(data.Posts)
          
        } catch (error) {
          message.warning('Error happed while fetching saved posts')
        }
      }

      getInitialSavedPosts()
      getInitialikes()

    }, [currentUser, posts])

    const value = {
          posts,
          setPosts,
          setSavedPosts,setLikedPosts,
          savedPosts, likedPosts
      }
    return (
      <PostsContext.Provider value={value}>
          {children}
      </PostsContext.Provider>
    );
  }
  