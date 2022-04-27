import React, {useState,  useContext, createContext, useEffect} from "react";
import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie'
import { followUserHandler, getNotifications } from "../api";
import { message } from "antd";
const io = require("socket.io-client");
const authContext = createContext();

export function useAuth() {
  return useContext(authContext);
}

export function AuthProvider({children}) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isAuth, setIsAuth] = useState(currentUser && Cookies.get('AUTH_TOKEN') ? true : false)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [notifications, setNotifications] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [socket, setSockt] = useState(null)
  useEffect(()=>{
    localStorage.setItem('followers', JSON.stringify(followers))
    localStorage.setItem('following', JSON.stringify(following))
  }, [followers, following])
  
  useEffect(()=>{
      const api = process.env.NODE_ENV === 'development' ? 'http://192.168.43.197:5000' : process.env.REACT_APP_API_KEY
      const _socket = io(api);
      setSockt(_socket)
  }, [])

  useEffect(() => {
    if(currentUser && socket){
     socket.emit('user', currentUser.username)
    }
  }, [socket, currentUser])

  useEffect(() => {
    socket?.on('onlineUsers', (data) => {
      setOnlineUsers(data)
    })
  }, [socket])

  useEffect(() => {
    socket?.on("notification", (notification)=>{
      // add notification only of it is not already in the array
      if(!notifications.includes(notification)){
        setNotifications([...notifications, notification])
      }
    })
  }, [socket,notifications])
  

  const handleUserFollow = async (e, user) => {
    e.preventDefault();
    try {
      const { data } = await followUserHandler(user);
      const { usr, isFollowing, msg } = data;
      message.success(msg);
      if (isFollowing) {
        setFollowing([...following, usr]);
      } else {
        setFollowing(following.filter((f) => f !== usr));
      }
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const {data} = await  getNotifications()
      const {notifications, following, followers} = data.response
      setNotifications(notifications)
      setFollowers(followers)
      setFollowing(following)
    }
   return fetchNotifications()
  }, [])

  
  useEffect(()=>{
    const user = currentUser
    const token  = Cookies.get('AUTH_TOKEN');
    
    if(!currentUser){
      Cookies.remove('AUTH_TOKEN',  {path: '/'})
      localStorage.clear()
      return setIsAuth(false)
    }
    const isAuthenticated = ()=>{
     return user && token ? true : false 
    }    
    localStorage.setItem('user', JSON.stringify(currentUser))
    return setIsAuth(isAuthenticated())
  }, [cookies, currentUser])



  const value = {
    currentUser,
    setCurrentUser,
    isAuth,
    cookies,
    setCookie,
    removeCookie,
    followers,
    setFollowers,
    following,
    setFollowing,
    notifications,
    setNotifications,
    onlineUsers,
    handleUserFollow,
  };
  return (
  <authContext.Provider value={value}>
    {children}
  </authContext.Provider>
  )
}
