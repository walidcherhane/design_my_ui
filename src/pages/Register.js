import React, {useState} from "react";
import {Link} from "react-router-dom";
import {BsPerson} from "react-icons/bs";
import {AiOutlineMail, AiOutlineLock, AiOutlineInfoCircle} from "react-icons/ai";
import {FiAtSign} from "react-icons/fi";
import {Avatar, DatePicker, Divider, Input, message, Modal,  Radio, Tooltip, Upload} from "antd";
import {useAuth} from "../contexts/authContext";
import {Helmet} from "react-helmet-async";
import validator from "validator";
import {register} from "../api";
import ImgCrop from "antd-img-crop";

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
    avatar: user.Photo || "https://ik.imagekit.io/buw7k7rvw40/bot_icon_still_2x_KKNChtLbJ.webp",
    gender: user.Gender || 'male',
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
            <label htmlFor="phone">Phone Number</label>
            <Input
              onChange={(e) => {
                setUser({...user, PhoneNumber: e.target.value});
              }}
              name="phone"
              type="tel"
              placeholder="Enter Phone Number"
            />
          </div>

          <div className="flex gap-x-10 flex-col ">
            <label htmlFor="altemail">Alternate Email Address</label>
            <Input
              onChange={(e) => {
                setUser({...user, AltEmail: e.target.value});
              }}
              name="altemail"
              type="email"
              placeholder="Enter Another Email Address"
            />
          </div>
          <div className="flex gap-x-10 flex-col ">
            <label htmlFor="phone">Birthday:</label>
            <DatePicker
              onChange={(date, dateString) => {
                setUser({...user, Birthday: dateString});
              }}
              format="YYYY/MM/DD"
              allowEmpty={false}
              showToday={false}
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
      <div className=" flex flex-col shadow-md px-4 sm:px-6 md:px-8 lg:px-10  mt-20 w-9/12  max-w-4xl relative  py-8 bg-white dark:bg-gray-900 mx-8 md:mx-0 rounded-3xl border-8 border-indigo-600/40 ">
        <div className="font-bold text-center text-3xl sm:text-3xl ">Join us Now</div>
        <div className="mx-10 mt-4 text-center text-sm sm:text-sm ">Enter your credentials to get access account</div>
        <Divider />
          <form onSubmit={(e)=>{
            e.preventDefault();
            setLoadModel(true)
          }}>
              <div className="flex flex-col gap-2 mb-4">
                  <div className='avatar mx-auto'>
                    <ImgCrop >
                      <Upload
                        name="avatar"
                        listType="picture" 
                        className="avatar-uploade" 
                        showUploadList={false}
                        onChange={handleFileChange}
                      >
                        <Avatar className="bg-gray-200 border-4 border-gray-200" size={100} src={userData.avatar} />
                        
                      </Upload>
                    </ImgCrop>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1 text-xs tracking-wide ">
                      Gender
                    </label>
                    <Radio.Group
                      required
                      onChange={(e) => {
                        setUser({...user, Gender: e.target.value});
                      }}
                      value={user.Gender}
                      defaultValue={'male'}
                    >
                      <Radio  value="male" >Male</Radio>
                      <Radio value="female">Female</Radio>
                    </Radio.Group>
                  </div>
                <div className="flex flex-col md:flex-row gap-2">
                      <div className="flex flex-col w-full">
                          <label htmlFor="email" className="mb-1 text-xs tracking-wide ">
                            Full Name:
                          </label>
                        <div className="relative">
                          <div className=" inline-flex items-center justify-center absolute left-0 top-0  h-full w-10 text-gray-400 ">
                            <BsPerson />
                          </div>
                          <input
                            required
                            onChange={(e) => {
                              setUser({...user, Name: e.target.value});
                            }}
                            id="name"
                            type="text"
                            name="name"
                            className="  text-sm  dark:text-white placeholder-gray-500 text-gray-900 bg-transparent  pl-10  pr-4  rounded-2xl  border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
                            placeholder="Enter your name"
                          />
                        </div>  
                      </div>
                      <div className="flex flex-col w-full">
                          <label htmlFor="email" className="mb-1 text-xs tracking-wide ">
                            Username :
                          </label>
                          <div className="relative">
                            <div className=" inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400 ">
                              <FiAtSign />
                            </div>

                            <input
                              required
                              onChange={(e) => {
                                setUser({...user, Username: e.target.value});
                              }}
                              id="username"
                              type="text"
                              name="username"
                              className="  text-sm  dark:text-white placeholder-gray-500 text-gray-900 bg-transparent pl-10  pr-4  rounded-2xl  border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
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
                      <div className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10  text-gray-400">
                        <AiOutlineMail />
                      </div>

                      <input
                        required
                        onChange={(e) => {
                          setUser({...user, Email: e.target.value});
                        }}
                        id="email"
                        type="email"
                        name="email"
                        className="  text-sm  dark:text-white placeholder-gray-500 text-gray-900 bg-transparent pl-10  pr-4  rounded-2xl  border border-gray-400  w-full  py-2  focus:outline-none focus:border-blue-400"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <label htmlFor="password" className="mb-1 text-xs tracking-wide">
                      Password:
                    </label>
                    <div className="relative">
                      <div className="  inline-flex  items-center  justify-center  absolute  left-0  top-0  h-full  w-10  text-gray-400">
                        <span>
                          <AiOutlineLock />
                        </span>
                      </div>

                      <input
                        required
                        onChange={(e) => {
                          setUser({...user, Password: e.target.value});
                        }}
                        id="password"
                        type="password"
                        name="password"
                        className="text-sm dark:text-white placeholder-gray-500 text-gray-900 bg-transparent pl-10 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none"
                        placeholder="Enter your password"
                      />
                        <Tooltip
                          title="Password must be at least 8 characters long"
                        >
                        <div className="  inline-flex  items-center  justify-center  absolute  right-0  top-0  h-full  w-10  text-gray-400">
                          <span>
                            <AiOutlineInfoCircle />
                          </span>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex  col-span-full	">
                <button
                  type="submit"
                  className=" flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-500 hover:bg-blue-600 rounded-2xl py-2 w-full transition duration-150 ease-in"
                  disabled={loading}
                >Sign Up</button>
              </div>
          </form>
        <div className="flex  justify-center items-center mt-6">
            Already have an account? 
            <Link to="/login" className="text-xs ml-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-2 px-4">
              Log in
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
