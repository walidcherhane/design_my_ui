import {
  Avatar,
  Button,
  Divider,
  Empty,
  Input,
  message,
  Modal,
  Popconfirm,
  Spin,
  Tabs,
  Tooltip,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteProfile,
  editProfile,
  followUserHandler,
  getProfile,
} from "../api";
import { useAuth } from "../contexts/authContext";
import { usePosts } from "../contexts/PostsContext";
import Post from "../components/Post";
import { Helmet } from "react-helmet-async";
import ImgCrop from "antd-img-crop";
import Text from "antd/lib/typography/Text";
import moment from "moment";
import { AiOutlineEdit } from "react-icons/ai";
import {RiUserUnfollowLine, RiUserFollowLine} from 'react-icons/ri';
import {motion} from 'framer-motion';
const { TabPane } = Tabs;
function Profile() {
  const { currentUser, setCurrentUser, setFollowing, following } = useAuth();
  const { posts, setPosts } = usePosts({});
  const [user, setUser] = useState({});
  const [modifiedUser, setModifiedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ProfileLoading, setProfileLoading] = useState(false);
  const [PasswordModelVisible, setPasswordModelVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [SavedPosts, setSavedPosts] = useState({});
  const { username } = useParams();
  const Navigate = useNavigate();
  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const fetchUserPosts = await getProfile(username);
        const { data } = fetchUserPosts;
        const { user, userPosts, savedPosts } = data;
        setSavedPosts(savedPosts);
        setPosts(userPosts);
        setUser(user);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error(error);
        Navigate("/posts");
      }
    };
    return getPosts();
  }, [setPosts, username, Navigate]);

  const handlePrfileChange = async () => {
    setProfileLoading(true);
    try {
      const { data } = await editProfile(modifiedUser);
      if (data.User) {
        message.success("You have successfully updated your profile 😊🎉");
        setModifiedUser(null);
        setCurrentUser(data.User);
      } else {
        message.error("We couldn't update your profile, try again 🤞🏼");
      }
      setProfileLoading(false);
    } catch (error) {
      message.error(error || "Error happened while updating profile 😢");
      setProfileLoading(false);
    }
  };

  const handleFileChange = ({ file, target }) => {
    let reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => {
      setModifiedUser({ ...modifiedUser, [target]: reader.result });
    };
  };
  const HandleProfileDelete = async () => {
    if (!deletePassword) return message.error("Password is required");
    try {
      const { data } = await deleteProfile(deletePassword);
      if (data.isDeleted) {
        setCurrentUser(null);
        message.success("Goodbye old friend 👋🏼😔");
      }
    } catch (error) {
      message.error(error);
    }
  };
  const handleUserFollow = async (e) => {
    e.preventDefault();
    try {
      const { data } = await followUserHandler(user.username);
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
  return (
    <>
      {loading ? (
        <div className="flex w-full h-screen items-center justify-center mt-20 ">
          <Helmet>
            <title>loading...</title>
          </Helmet>
          <Spin size="middle" tip="Loading..." />
        </div>
      ) : (
        user &&
        currentUser && (
          <div className="container mx-auto">
            <Helmet>
              <title>{`${user.name?.split(" ")[0]}'s Profile`}</title>
            </Helmet>
            <div className="grid sm:gap-4 min-h-screen grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 m-0 sm:m-5 pt-24">
              <div className="profile flex  mx-8 sm:mx-2 md:mx-0  bg-white rounded-t-2xl  overflow-hidden sm:shadow-xl dark:bg-gray-900/20 items-start justify-start flex-col ">
                <div className="profile-head mb-20  h-32  w-full flex flex-cols   relative justify-center items-end ">
                  {currentUser._id === user._id ? (
                    <ImgCrop aspect={4 / 2}>
                      <Upload
                        name="header_photo"
                        listType="picture"
                        maxCount={1}
                        showUploadList={false}
                        onChange={({ file }) => {
                          handleFileChange({ file, target: "headerPhoto" });
                        }}
                      >
                        <img
                          src={
                            modifiedUser?.headerPhoto || currentUser.headerPhoto
                          }
                          alt={`${currentUser?.name.split(" ")[0]}'s header`}
                          className="h-full w-full  object-cover absolute inset-0"
                        />
                      </Upload>
                    </ImgCrop>
                  ) : (
                    <img
                      src={user.headerPhoto}
                      alt={`${user.name?.split(" ")[0]}'s header`}
                      className="h-full w-full object-cover absolute inset-0 "
                    />
                  )}

                  <div className="  avatar w-28 h-28 rounded-full border-4 bg-white border-white dark:border-[#272F33] overflow-hidden translate-y-16 ">
                    {currentUser._id === user._id ? (
                      <ImgCrop>
                        <Upload
                          name="avatar"
                          listType="picture"
                          className="avatar-uploader"
                          showUploadList={false}
                          onChange={({ file }) => {
                            handleFileChange({ file, target: "avatar" });
                          }}
                        >
                          <Avatar
                            size={112}
                            src={modifiedUser?.avatar || currentUser.avatar}
                          />
                        </Upload>
                      </ImgCrop>
                    ) : (
                      <img
                        src={user.avatar}
                        alt=""
                        className=" object-cover object-center"
                      />
                    )}
                  </div>

                </div>
                {currentUser._id !== user._id && (
                    <motion.span
                      layout
                      role="button"
                      onClick={handleUserFollow}
                      className=" mx-auto text-white bg-gradient-to-r from-[#096dd9] to-[#1890ff] shadow-xl shadow-[#0000ff63] font-medium p-1 px-4 rounded-full mb-4  text-center "
                    >

                      {following.includes(user._id) ? (
                        <span className="text-white"><RiUserUnfollowLine /> Following</span>
                      ) : (
                        <span className="text-white"><RiUserFollowLine /> Follow</span>
                      )}
                    </motion.span>
                  )}
                <div className="text-center w-full">
                  <Text
                    editable={
                      currentUser._id === user._id
                        ? {
                            icon: <AiOutlineEdit />,
                            tooltip: "click to edit text",
                            onChange: (value) => {
                              setModifiedUser({ ...modifiedUser, name: value });
                            },
                          }
                        : false
                    }
                    className=" text-gray-800  dark:text-gray-300 font-bold text-xl"
                  >
                    {currentUser._id === user._id
                      ? modifiedUser?.name || currentUser.name
                      : user.name}
                  </Text>
                  <Divider style={{ marginTop: 0 }}>{user.username}</Divider>
                </div>
                <div className="px-4 w-full">
                  <div className="bio mt-4 text-gray-600 dark:text-gray-200 text-start w-full">
                    {" "}
                    <Text
                      editable={
                        currentUser._id === user._id
                          ? {
                              icon: <AiOutlineEdit />,
                              tooltip: "click to edit text",
                              onChange: (value) => {
                                setModifiedUser({
                                  ...modifiedUser,
                                  bio: value,
                                });
                              },
                              maxLength: 200,
                              autoSize: { minRows: 3 },
                            }
                          : false
                      }
                      className="text-gray-800 font-normal dark:text-gray-200"
                    >
                      {currentUser._id === user._id
                        ? modifiedUser?.bio ||
                          currentUser.bio ||
                          "Add your bio here"
                        : user.bio}
                    </Text>
                  </div>

                  <Divider />
                  <ul className="about flex flex-col gap-y-4">
                    <li className="flex justify-between w-full">
                      <div className="text-gray-400 font-semibold capitalize dark:text-gray-200">
                        Email:{" "}
                      </div>
                      <Text
                        editable={
                          currentUser._id === user._id
                            ? {
                                icon: <AiOutlineEdit />,
                                tooltip: "click to edit text",
                                onChange: (value) => {
                                  setModifiedUser({
                                    ...modifiedUser,
                                    email: value,
                                  });
                                },
                              }
                            : false
                        }
                        className="text-gray-800 font-normal dark:text-gray-400"
                      >
                        {currentUser._id === user._id
                          ? modifiedUser?.email || currentUser.email
                          : user.email}
                      </Text>
                    </li>
                    <li className="flex justify-between w-full">
                      <div className="text-gray-400 font-semibold capitalize dark:text-gray-200">
                        From:{" "}
                      </div>
                      <Text
                        editable={
                          currentUser._id === user._id
                            ? {
                                icon: <AiOutlineEdit />,
                                tooltip: "click to edit text",
                                onChange: (value) => {
                                  setModifiedUser({
                                    ...modifiedUser,
                                    address: value,
                                  });
                                },
                              }
                            : false
                        }
                        className="text-gray-800 font-normal dark:text-gray-400"
                      >
                        {currentUser._id === user._id
                          ? modifiedUser?.address || currentUser.address
                          : user.address}
                      </Text>
                    </li>
                    <li className="flex justify-between">
                      <div className="text-gray-400 font-semibold capitalize dark:text-gray-200">
                        Gender:{" "}
                      </div>
                      <span className="text-gray-800 font-normal dark:text-gray-400 capitalize">
                        {" "}
                        {user.gender}{" "}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <div className="text-gray-400 font-semibold capitalize dark:text-gray-200">
                        Member Since:{" "}
                      </div>
                      <Tooltip
                        title={moment(
                          user.memberSince,
                          "DD/MMM/YYYY"
                        ).fromNow()}
                      >
                        <span className="text-gray-800 font-normal dark:text-gray-400">
                          {" "}
                          {user.memberSince}{" "}
                        </span>
                      </Tooltip>
                    </li>
                  </ul>
                </div>
                <Divider />
                {currentUser._id === user._id && (
                  <div className="flex w-full flex-col mt-3 gap-3 px-4">
                    <Button
                      disabled={!modifiedUser}
                      loading={ProfileLoading}
                      onClick={handlePrfileChange}
                      block
                      type="dashed"
                    >
                      Submit Changes
                    </Button>
                    {modifiedUser ? (
                      <Button
                        onClick={() => {
                          setModifiedUser(null);
                        }}
                        block
                      >
                        Reset all changes
                      </Button>
                    ) : (
                      <Popconfirm
                        title="Are you sure you are living us? 💔 "
                        onConfirm={() => setPasswordModelVisible(true)}
                        okText="Yes 😣"
                        okType="danger"
                        cancelText="Never ❤"
                      >
                        <Button type="danger" block ghost>
                          Delete Profile
                        </Button>
                      </Popconfirm>
                    )}
                  </div>
                )}
              </div>
              <Modal
                title="Please Enter your password"
                visible={PasswordModelVisible}
                onCancel={() => {
                  setPasswordModelVisible(false);
                }}
                footer={[
                  <Button
                    type="dashed"
                    onClick={() => {
                      setPasswordModelVisible(false);
                    }}
                  >
                    Cancel
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    htmlType="submit"
                    danger
                    ghost
                    onClick={HandleProfileDelete}
                  >
                    Submit
                  </Button>,
                ]}
              >
                <Input.Password
                  required
                  placeholder="input password"
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                  }}
                />
                {posts.length > 0 && (
                  <>
                    <Divider dashed />
                    <p className="text-[13px] italic text-red-400 ">
                      *Please note that once you delete your account all your
                      posts won't be deleted !, If still you will need to delete
                      them, Do so before deleting your account
                    </p>
                  </>
                )}
              </Modal>
              <motion.div layout className="md:col-span-1 lg:col-span-2 xl:col-span-3 2xl:col-span-4  pt-4">
                <Tabs defaultActiveKey="1">
                  <TabPane tab={`${user.name?.split(" ")[0]}'s Posts `} key="1">
                    <motion.div layout className="grid gap-4  grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
                      {posts.length ? (
                        posts.map((post) => (
                          <Post post={post} currentUser={user} key={post._id} />
                        ))
                      ) : (
                        <div className="col-span-full  flex items-center justify-center">
                          <Empty
                            description={`${
                              currentUser._id === user._id
                                ? "You"
                                : user.name?.split(" ")[0]
                            } didn't post anything yet`}
                          />
                        </div>
                      )}
                    </motion.div>
                  </TabPane>
                  <TabPane
                    tab={`${user.name?.split(" ")[0]}'s Saved Posts `}
                    key="2"
                  >
                    <motion.div layout className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                      {SavedPosts.length ? (
                        SavedPosts.map((post) => (
                          <Post post={post} currentUser={user} key={post._id} />
                        ))
                      ) : (
                        <div className="col-span-full  flex items-center justify-center">
                          <Empty
                            description={`${
                              currentUser._id === user._id
                                ? "You"
                                : user.name?.split(" ")[0]
                            } didn't save any post yet`}
                          />
                        </div>
                      )}
                    </motion.div>
                  </TabPane>
                </Tabs>
              </motion.div>
            </div>
          </div>
        )
      )}
    </>
  );
}

export default Profile;
