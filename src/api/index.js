import axios from "axios";
import Cookies from 'js-cookie'

const API = axios.create({ 
      baseURL:process.env.NODE_ENV === 'development' ? 
      'http://192.168.43.197:5000' : process.env.REACT_APP_API_KEY
});

API.interceptors.request.use((req) => {
      req.headers.authorization = `Bearer ${Cookies.get('AUTH_TOKEN')}`
      return req;
});

API.interceptors.response.use((res) =>{ 
      return res
} , error=> { 
      if (error.response && error.response?.status === 401){
            Cookies.remove('AUTH_TOKEN',{path: '/'})
            localStorage.clear()
      }
      return Promise.reject( error.response?.data?.error)
})


export const register = async (userData) =>{ return await API.post('/signup', userData)}
export const login = async (userData)=>{ return await API.post('/signin', userData)}


export const getProfile = async(username)=>{ return await API.get(`/${username}/profile `)}
export const editProfile = async(modifiedUser)=>{ return await API.patch(`/profile/edit`, modifiedUser)}
export const deleteProfile = async(password)=>{ return await API.delete('/profile/delete', {data: {password}}) }
export const SendUserEmailVerification = async()=>{ return await API.get('/verify')}
export const verifyUserEmailToken = async(token)=>{ return await API.patch(`/verify/${token}`)}
export const changeUserPassword = async(data)=>{ return await API.patch('/auth/change-password', {data})}

export const followUserHandler = async (username)=>{ return await API.patch(`/follow/${username}`)}
export const getNotifications = async ()=>{ return await API.get(`/notifications/`)}
export const deleteNotification = async (id)=>{ return await API.delete(`/notifications/delete`, {data: {id}})}
export const getPosts = async (sortPref)=>{ return await API.get('/posts', {params: {sortBy: sortPref}})}
export const handlePostSave = async (Post)=>{ return await API.put('/posts', Post)}
export const getPost = async (id)=>{ return await API.get(`/posts/post/${id}`)}
export const deletePost = async (id)=>{ return await API.delete(`/posts/${id}`)}
export const editPost = async ({id,modifiedPost })=>{ return await API.put(`/posts/${id}/edit`, modifiedPost)}
export const getSavedPosts = async (id)=>{ return await API.get(`/posts/${id}/saved_posts`)}
export const getLikedPosts = async ()=>{ return await API.get(`/posts/liked_posts`)}
export const addPost =  async(data)=>{ return await API.post('/posts/addpost', data)}
export const likePost = async(id)=>{ return await API.patch(`/posts/${id}`)}
export const searchPosts  = async(searchQuery)=>{ return await API.get(`/posts/search/${searchQuery}`)}                                                     