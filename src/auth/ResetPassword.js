import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  forgetPasswordHandler,
  handleForgetPasswordResponse,
  handlePasswordReset,
} from "../api";
import { Divider } from "antd";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { HiOutlineLockOpen } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
function ResetPassword() {
  const [currentStep, setCurrentStep] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [resetData, setResetData] = useState({});
  const Navigate = useNavigate();
  const { token } = useParams();
  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      try {
        const {
          data: { isValidToken },
        } = await handleForgetPasswordResponse(token);
        setLoading(false);
        if (isValidToken) {
          setCurrentStep(3);
          return;
        }
        setError("Invalid token please request new one");
      } catch (error) {
        setLoading(false);
        setError(error);
        if (error.includes("token")) {
          setCurrentStep(1);
        }
      }
    };
    validateToken();
  }, [token]);
  const PasswordResetHandler = async (e) => {
    setError(null);
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await handlePasswordReset({
        token,
        newPassword: resetData.password,
        newPasswordConfirm: resetData.confirmPassword,
      });
      message.success(data.message);
      Navigate("/login");
      setLoading(false);
    } catch (error) {
      if (error.includes("token")) {
        setCurrentStep(1);
      }
      setError(error);
      setLoading(false);
    }
  };
  const ResetPasswordTokenHandler = async (e) => {
    setError(null);
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await forgetPasswordHandler(resetData.email);
      message.success(data.message);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };
  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center justify-center ">
      {currentStep === 1 && (
        <div className="flex flex-col shadow-md sm:px-6 md:px-8 lg:px-10  sm:mt-24 w-50 max-w-md relative px-4 py-8 bg-white dark:bg-zinc-800 sm:mx-8 md:mx-0  border-8 border-indigo-600/40">
          <h1 className="font-bold text-center text-3xl sm:text-3xl">
            Enter Your Email
          </h1>
          <p className="mt-4 self-center mx-10 text-center text-sm sm:text-sm">
            We will send you a link to reset your password
          </p>
          <Divider />

          <form onSubmit={ResetPasswordTokenHandler}>
            {error && (
              <p className="text-red-500 text-center p-2 bg-red-200 mb-2 border border-red-500 capitalize">
                {error}
              </p>
            )}
            <div className="flex gap-4 flex-col ">
              <div className="flex flex-col">
                <label className="mb-2 text-xs tracking-wide ">
                  Email Address
                </label>
                <div className="relative">
                  <div className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10 text-gray-400">
                    <AiOutlineMail />
                  </div>
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    className="bg-transparent text-sm dark:text-white placeholder-gray-500 text-gray-900  pl-10  pr-4    border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
                    onChange={(e) => {
                      setError(null);
                      setResetData({
                        ...resetData,
                        email: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-500 hover:bg-blue-600  py-2 w-full transition duration-150 ease-in"
                disabled={loading}
              >
                {loading ? "Please Wait..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      )}
      {currentStep === 3 && (
        <div className="flex flex-col shadow-md sm:px-6 md:px-8 lg:px-10  sm:mt-24 w-50 max-w-md relative px-4 py-8 bg-white dark:bg-zinc-800 sm:mx-8 md:mx-0  border-8 border-indigo-600/40">
          <h1 className="font-bold text-center text-3xl sm:text-3xl">
            Type your new password
          </h1>
          <p className="mt-4 self-center mx-10 text-center text-sm sm:text-sm">
            Please enter your new password
          </p>
          <Divider />

          <form onSubmit={PasswordResetHandler}>
            {error && (
              <p className="text-red-500 text-center p-2 bg-red-200 mb-2 border border-red-500 capitalize">
                {error}
              </p>
            )}
            <div className="flex gap-4 flex-col ">
              <div className="flex flex-col">
                <label className="mb-2 text-xs tracking-wide ">
                  New Password:
                </label>
                <div className="relative">
                  <div className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10 text-gray-400">
                    <HiOutlineLockOpen />
                  </div>
                  <input
                    required
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Password"
                    className="bg-transparent text-sm dark:text-white placeholder-gray-500 text-gray-900  pl-10  pr-4    border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
                    onChange={(e) => {
                      setError(null);
                      setResetData({
                        ...resetData,
                        password: e.target.value,
                      });
                    }}
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
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-xs tracking-wide ">
                  New Password Confirm:
                </label>
                <div className="relative">
                  <div className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10 text-gray-400">
                    <HiOutlineLockOpen />
                  </div>
                  <input
                    required
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="bg-transparent text-sm dark:text-white placeholder-gray-500 text-gray-900  pl-10  pr-4    border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
                    onChange={(e) => {
                      setError(null);
                      setResetData({
                        ...resetData,
                        confirmPassword: e.target.value,
                      });
                    }}
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
              </div>
              <button
                type="submit"
                className="flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-500 hover:bg-blue-600  py-2 w-full transition duration-150 ease-in"
                disabled={loading}
              >
                {loading ? "Please Wait..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
