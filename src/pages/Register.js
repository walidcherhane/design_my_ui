import React, {useState} from "react";
import {Link} from "react-router-dom";
import {BsPerson} from "react-icons/bs";
import {AiOutlineMail, AiOutlineLock, AiOutlineInfoCircle} from "react-icons/ai";
import {FiAtSign} from "react-icons/fi";
import {Avatar, DatePicker, Divider, Input, message, Modal,  Radio, Tooltip, Upload} from "antd";
import {useAuth} from "../contexts/authContext";
import {Helmet} from "react-helmet-async";
import {register} from "../api";
import ImgCrop from "antd-img-crop";
import moment from "moment";
import {AiFillCamera} from "react-icons/ai";
import {FiHelpCircle} from "react-icons/fi";
const {TextArea} = Input;
function Register() {
  const [user, setUser] = useState({});
  const {setCookie, setCurrentUser} = useAuth();
  const [loading, setLoading] = useState();
  const [loadModel, setLoadModel] = useState(false);
  const userData = {
    name: user.Name,
    email: user.Email,
    password: user.Password,
    avatar: user.Photo,
    gender: user.Gender,
    phoneNumber: user.PhoneNumber,
    bio: user.Bio,
    address: user.Address,
    birthday: user.Birthday,
    altEmail: user.AltEmail,
    username: user.Username,
  };
  const handleFileChange = ({file}) => {
    let reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => {
      setUser({...user, Photo: reader.result});
    };
  };
  const handleFormLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {data} = await register(userData);
      const {user, token} = data;
      setCurrentUser(user);
      message.success(`Hello ${user.name.split(" ")[0]}!, Welcome :)`);
      setCookie("AUTH_TOKEN", token, {maxAge: 604800, path: "/"});
      localStorage.setItem('user', JSON.stringify(user))
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error || "Something happened, please try again later");
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <Helmet>
        <title>{loading ? "loading..." : "Create Account"}</title>
      </Helmet>
      <Modal
        width={700}
        title="Tell us more about you! (optional)"
        visible={loadModel}
        onOk={handleFormLogin}
        confirmLoading={loading}
        okText="Continue"
        cancelText="Cancel"
        onCancel={() => {
          setLoadModel(false);
        }}
      >
        <div className="grid gap-4 grid-cols-2 p-4">
          <div className="flex gap-x-10 flex-col ">
            <label htmlFor="phone">Birthday:</label>
            <DatePicker
              onChange={(date, dateString) => {
                setUser({...user, Birthday: dateString});
              }}
              format="YYYY/MM/DD"
              allowEmpty={false}
              showToday={false}
              placeholder="Select your birthday"
              disabledDate={(current) => {
                return current && current > moment().subtract(17, "years");
              }}
            />
          </div>
          <div className="flex gap-x-10  flex-col ">
            <label htmlFor="adress">Home Address:</label>
            <Input
              onChange={(e) => {
                setUser({...user, Address: e.target.value});
              }}
              name="adress"
              type="text"
              placeholder="I live in..."
            />
          </div>
          <div className="flex gap-x-10 col-span-2 flex-col ">
            <label htmlFor="bio">Add Your Bio!</label>
            <TextArea
              placeholder={`Hey! my name is ${user.Name || "john doe"}, I love...`}
              name="bio"
              onChange={(e) => {
                setUser({...user, Bio: e.target.value});
              }}
              rows={4}
              showCount
              maxLength={200}
            />
          </div>
        </div>
      </Modal>
      <div className=" flex flex-col shadow-md px-4 sm:px-6 md:px-8 lg:px-10  mt-28 sm:w-9/12  max-w-4xl relative  py-8 bg-white dark:bg-zinc-800    border-8 border-indigo-600/40 ">
        <h1 className="font-bold text-center text-3xl sm:text-3xl dark:text-white ">Join us Now</h1>
        <p className="mx-10 mt-4 text-center text-sm sm:text-sm ">Enter your credentials to get access account</p>
        <Divider />
          <form onSubmit={(e)=>{
            e.preventDefault();
            setLoadModel(true)
          }}>
              <div className="flex flex-col gap-2 mb-4">
                  <div className='avatar mx-auto relative'>
                    <ImgCrop >
                      <Upload
                        name="avatar"
                        listType="picture" 
                        className="avatar-uploade" 
                        showUploadList={false}
                        onChange={handleFileChange}
                      >
                        <Avatar className="bg-gray-200 border-4 border-gray-200" size={100} src={userData.avatar || "https://ik.imagekit.io/buw7k7rvw40/bot_icon_still_2x_KKNChtLbJ.webp"} alt='User avatar' />
                        <span className="  w-full h-full  flex justify-center items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  z-10 text-2xl text-white rounded-full bg-gray-800/40">
                          <AiFillCamera />
                        </span>
                      </Upload>
                    </ImgCrop>
                  </div>
                  <div className="flex mt-4 mx-auto flex-col">
                    <Radio.Group
                      name="gender"
                      required
                      onChange={(e) => {
                        setUser({...user, Gender: e.target.value});
                      }}
                      value={user.Gender}
                      defaultValue={'male'}
                    >
                      <Radio value="male" >Male</Radio>
                      <Radio value="female">Female</Radio>
                    </Radio.Group>
                  </div>
                <div className="flex flex-col md:flex-row gap-2">
                      <div className="flex flex-col w-full">
                          <label htmlFor="name" className="mb-1 text-xs tracking-wide ">
                            Full Name:
                          </label>
                        <div className="relative">
                          <span className=" inline-flex items-center justify-center absolute left-0 top-0  h-full w-10 text-gray-400 ">
                            <BsPerson />
                          </span>
                          <input
                            required
                            onChange={(e) => {
                              setUser({...user, Name: e.target.value});
                            }}
                            id="name"
                            type="text"
                            name="name"
                            className="  text-sm  dark:text-white placeholder-gray-500 text-gray-900 bg-transparent  pl-10  pr-4    border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
                            placeholder="Enter your name"
                          />
                        </div>  
                      </div>
                      <div className="flex flex-col w-full">
                          <label htmlFor="username" className="mb-1 text-xs tracking-wide ">
                            Username :
                          </label>
                          <div className="relative">
                            <span className=" inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400 ">
                              <FiAtSign />
                            </span>
                            <input
                              required
                              onChange={(e) => {
                                setUser({...user, Username: e.target.value});
                              }}
                              id="username"
                              type="text"
                              name="username"
                              className="  text-sm  dark:text-white placeholder-gray-500 text-gray-900 bg-transparent pl-10  pr-4    border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
                              placeholder="How do you want to be called ?"
                            />
                          </div>
                      </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 ">
                  <div className="flex flex-col  w-full">
                    <label htmlFor="email" className="mb-1 text-xs tracking-wide ">
                      E-Mail Address:
                    </label>
                    <div className="relative">
                      <span className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10  text-gray-400">
                        <AiOutlineMail />
                      </span>

                      <input
                        required
                        onChange={(e) => {
                          setUser({...user, Email: e.target.value});
                        }}
                        id="email"
                        type="email"
                        name="email"
                        className="  text-sm  dark:text-white placeholder-gray-500 text-gray-900 bg-transparent pl-10  pr-4    border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <label htmlFor="password" className="mb-1 text-xs tracking-wide">
                      Password:
                    </label>
                    <div className="relative">
                      <span className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10  text-gray-400">
                          <AiOutlineLock />
                      </span>
                      <input
                        required
                        onChange={(e) => {
                          setUser({...user, Password: e.target.value});
                        }}
                        id="password"
                        type="password"
                        name="password"
                        className="text-sm dark:text-white placeholder-gray-500 text-gray-900 bg-transparent pl-10 pr-4  border border-gray-400 w-full py-2 focus:outline-none"
                        placeholder="Enter your password"
                      />
                        <Tooltip
                          title="Password must be at least 8 characters long"
                        >
                        <div className="  inline-flex  items-center  justify-center  absolute  right-0  top-0  h-full  w-10  text-gray-400">
                            <FiHelpCircle />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex  col-span-full	">
                <button
                  type="submit"
                  className=" flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-500 hover:bg-blue-600  py-2 w-full transition duration-150 ease-in"
                  disabled={loading}
                >Sign Up</button>
              </div>
          </form>
        <div className="flex gap-x-2 justify-center items-center mt-6">
            Already have an account? 
            <Link to="/login">
              Log in
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
