import React, {useState} from "react";
import {Link} from "react-router-dom";
import { HiOutlineLockOpen, HiOutlineUser} from "react-icons/hi";
import { useAuth } from "../contexts/authContext";
import { Helmet } from "react-helmet-async";
import { login } from "../api";
import { LoadingOutlined } from "@ant-design/icons";
import { message } from 'antd';
function Login() {
  const [User, setUser] = useState({email: "", password: ""});
  const [loading, setLoading] = useState(false);
  const {setCurrentUser,setCookie } = useAuth()
  const handleFormLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {      
      const { data } = await login(User) 
      const {user, token} = data
      setCurrentUser(user)
      message.success(`Hello ${user.name.split(' ')[0]}, Welcome back! 😊`)
      setCookie('AUTH_TOKEN', token , {maxAge: 604800 , path: '/'})
      localStorage.setItem('user', JSON.stringify(user))
      setLoading(false)
    } catch (error) {
      message.error(error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">    
        <Helmet>
            <title>{loading ? 'loading...' : 'Log in' }</title>
        </Helmet>
      <div className=" flex flex-col shadow-md sm:px-6 md:px-8 lg:px-10  mt-20 w-50 max-w-md relative px-4 py-10 bg-white dark:bg-zinc-800 mx-8 md:mx-0 rounded-3xl border-8 border-indigo-600/40 ">
        <div className="font-bold self-center text-3xl sm:text-3xl "> Welcome Back </div>
        <div className="mt-4 self-center mx-10 text-center text-sm sm:text-sm "> Enter your credentials to access your account </div>
        <div className="mt-10">
          <form onSubmit={handleFormLogin}>
            <div className="flex flex-col mb-5">
              <label htmlFor="text" className="mb-1 text-xs tracking-wide ">
                E-Mail Address OR Username:
              </label>
              <div className="relative">
                <div className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10 text-gray-400">
                  <HiOutlineUser />
                </div>
                <input
                  onChange={(e) => {
                    setUser({...User, email: e.target.value});
                  }}
                  required
                  type='text'
                  id="username"
                  name="text"
                  className=" bg-transparent text-sm dark:text-white placeholder-gray-500 text-gray-900  pl-10  pr-4  rounded-2xl  border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
                  placeholder="Email or username"
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <label htmlFor="password" className="mb-1 text-xs sm:text-sm tracking-wide ">
                Password:
              </label>
              <div className="relative">
                <div className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10  text-gray-400">
                  <span>
                    <HiOutlineLockOpen />
                  </span>
                </div>

                <input
                  onChange={(e) => {
                    setUser({...User, password: e.target.value});
                  }}
                  required
                  id="password"
                  type="password"
                  name="password"
                  className=" bg-transparent text-sm dark:text-white placeholder-gray-500 text-gray-900 pl-10 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 "
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex w-full">
              <button
                type="submit"
                className=" flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-500 hover:bg-blue-600 rounded-2xl py-2 w-full transition duration-150 ease-in"
                disabled={loading}
              >
                {loading ? <LoadingOutlined /> : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex justify-center items-center mt-6">
        <span className="">
          Don't have an account? 
          <Link to="/register" className="text-xs ml-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-2 px-4">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Login;
