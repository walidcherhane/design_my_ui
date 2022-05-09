import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineLockOpen, HiOutlineUser } from "react-icons/hi";
import { useAuth } from "../contexts/authContext";
import { Helmet } from "react-helmet-async";
import { forgetPasswordHandler, login } from "../api";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Divider, Input, message, Modal } from "antd";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
function Login() {
  const [User, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState("");
  const [resetPaswordModel, setResetPaswordModel] = useState(false);
  const [sendingEmailLoader, setSendingEmailLoader] = useState(false);
  const { setCurrentUser, setCookie } = useAuth();

  const handleFormLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(User);
      const { user, token } = data;
      setCurrentUser(user);
      message.success(`Hello ${user.name.split(" ")[0]}, Welcome back! 😊`);
      setCookie("AUTH_TOKEN", token, { maxAge: 604800, path: "/" });
      localStorage.setItem("user", JSON.stringify(user));
      setLoading(false);
    } catch (error) {
      message.error(error);
      setLoading(false);
    }
  };
  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setSendingEmailLoader(true);
    try {
      if (
        !passwordResetEmail?.match(
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        )
      )
        message.error("Please enter a valid email address");
      const { data } = await forgetPasswordHandler(passwordResetEmail);
      message.success(data.message);
      setSendingEmailLoader(false);
    } catch (error) {
      message.error(error);
      setSendingEmailLoader(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <Helmet>
        <title>{loading ? "loading..." : "Log in"}</title>
      </Helmet>
      <Modal
        title="Reset your account password"
        visible={resetPaswordModel}
        onCancel={() => {
          setResetPaswordModel(false);
        }}
        footer={[
          <div className="flex justify-end items-center">
            <Button
              type="dashed"
              disabled={sendingEmailLoader}
              onClick={() => {
                setResetPaswordModel(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex items-center"
              type="button"
              htmlType="button"
              loading={sendingEmailLoader}
              disabled={
                passwordResetEmail.match(
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ) === null || sendingEmailLoader
              }
              onClick={handleForgetPassword}
            >
              {sendingEmailLoader ? "Please Wait..." : "Send password reset email"}
            </Button>
            </div>
        ]}
      >
        <div className="flex flex-col gap-y-4">
          <Input
            placeholder="Type your email"
            onChange={(e) => setPasswordResetEmail(e.target.value)}
          />
        </div>
      </Modal>
      <div className=" flex flex-col shadow-md sm:px-6 md:px-8 lg:px-10  sm:mt-24 w-50 max-w-md relative px-4 py-8 bg-white dark:bg-zinc-800 sm:mx-8 md:mx-0  border-8 border-indigo-600/40 ">
        <div className="font-bold self-center text-3xl sm:text-3xl ">
          {" "}
          Welcome Back{" "}
        </div>
        <div className="mt-4 self-center mx-10 text-center text-sm sm:text-sm ">
          {" "}
          Enter your credentials to access your account{" "}
        </div>
        <Divider />
        <div className="mt-4">
          <form onSubmit={handleFormLogin}>
            <div className="flex flex-col mb-5">
              <label htmlFor="text" className="mb-2 text-xs tracking-wide ">
                E-Mail Address OR Username:
              </label>
              <div className="relative">
                <div className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10 text-gray-400">
                  <HiOutlineUser />
                </div>
                <input
                  onChange={(e) => {
                    setUser({ ...User, email: e.target.value });
                  }}
                  required
                  type="text"
                  id="username"
                  name="text"
                  className=" bg-transparent text-sm dark:text-white placeholder-gray-500 text-gray-900  pl-10  pr-4    border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
                  placeholder="Email or username"
                />
              </div>
            </div>
            <div className="flex flex-col mb-6">
              <label htmlFor="password" className="mb-2 text-xs tracking-wide ">
                Password:
              </label>
              <div className="relative">
                <span className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10  text-gray-400">
                  <HiOutlineLockOpen />
                </span>

                <input
                  onChange={(e) => {
                    setUser({ ...User, password: e.target.value });
                  }}
                  required
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  className=" bg-transparent text-sm dark:text-white placeholder-gray-500 text-gray-900 pl-10 pr-4  border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 "
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPasswordVisible(!passwordVisible);
                  }}
                  className="  inline-flex  items-center  justify-center  absolute  right-0  top-0  h-full  w-10  text-gray-400"
                >
                  {passwordVisible ? (
                    <MdOutlineVisibilityOff />
                  ) : (
                    <MdOutlineVisibility />
                  )}
                </button>
              </div>
              <p className="underline text-gray-400 mt-2 ">
                <button
                  type="button"
                  onClick={() => {
                    setResetPaswordModel(true);
                  }}
                  className="text-sm text-gray-400 hover:text-gray-600"
                >
                  Forgot Password?
                </button>
              </p>
            </div>

            <div className="flex w-full">
              <button
                type="submit"
                className=" flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-500 hover:bg-blue-600  py-2 w-full transition duration-150 ease-in"
                disabled={loading}
              >
                {loading ? <LoadingOutlined /> : "Login"}
              </button>
            </div>
          </form>
        </div>
        <div className="flex gap-2 justify-center items-center mt-6">
          Don't have an account?
          <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
