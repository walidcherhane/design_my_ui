import {
  Alert,
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
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  changeUserPassword,
  deleteProfile,
  editProfile,
  followUserHandler,
  getProfile,
} from "../api";
import moment from "moment";
import { useAuth } from "../contexts/authContext";
import { usePosts } from "../contexts/PostsContext";
import Post from "../components/Post";
import { Helmet } from "react-helmet-async";
import ImgCrop from "antd-img-crop";
import Text from "antd/lib/typography/Text";
import { AiOutlineEdit } from "react-icons/ai";
import { motion } from "framer-motion";
import { AiFillCamera } from "react-icons/ai";
import { HiMail, HiUser, HiUsers, HiLocationMarker } from "react-icons/hi";
const { TabPane } = Tabs;
function Profile() {
  const { currentUser, setCurrentUser, setFollowing, following } = useAuth();
  const { posts, setPosts } = usePosts({});
  const [user, setUser] = useState({});
  const [modifiedUser, setModifiedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ProfileLoading, setProfileLoading] = useState(false);
  const [PasswordModelVisible, setPasswordModelVisible] = useState(false);
  const [changePasswordModelVisible, setChangePasswordModelVisible] =
    useState(false);
  const [changePasswordData, setChangePasswordData] = useState({
    password: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
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
    getPosts();
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
      const { usr, isFollowing } = data;
      if (isFollowing) {
        setFollowing([...following, usr]);
      } else {
        setFollowing(following.filter((f) => f !== usr));
      }
    } catch (error) {
      message.error(error);
    }
  };
  const HanlePasswordChange = async () => {
    try {
      const { data } = await changeUserPassword(changePasswordData);
      message.success(data.message);
    } catch (error) {
      message.error(error);
    }
  };
  const canEdit = currentUser?._id === user?._id;
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
                  {canEdit ? (
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
                        <span className=" w-10 h-10 flex justify-center items-center absolute bottom-2 right-2 z-10 text-xl text-white rounded-full bg-gray-900/50">
                          <AiFillCamera />
                        </span>
                      </Upload>
                    </ImgCrop>
                  ) : (
                    <img
                      src={user.headerPhoto}
                      alt={`${user.name?.split(" ")[0]}'s header`}
                      className="h-full w-full object-cover absolute inset-0 "
                    />
                  )}

                  <div className=" relative avatar w-28 h-28 rounded-full border-4  border-white dark:border-[#272F33] overflow-hidden translate-y-16 ">
                    {canEdit ? (
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
                            style={{ width: 100 + "%", height: 100 + "%", backgroundColor: "white" }}
                            src={modifiedUser?.avatar || currentUser.avatar}
                          />
                          <span className="  w-full h-full transition opacity-0 hover:opacity-100 flex justify-center items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  z-10 text-xl text-white rounded-full bg-gray-900/50">
                            <AiFillCamera />
                          </span>
                        </Upload>
                      </ImgCrop>
                    ) : (
                      <Avatar
                        style={{ width: 100 + "%", height: 100 + "%", backgroundColor: "white" }}
                        src={user.avatar}
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
                    <span className="text-white">
                      {following.includes(user._id) ? "Following" : "Follow"}
                    </span>
                  </motion.span>
                )}
                <div className="text-center w-full">
                  <Text
                    editable={
                      canEdit
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
                    {canEdit
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
                        canEdit
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
                      {canEdit
                        ? modifiedUser?.bio ||
                          currentUser.bio ||
                          "Add your bio here"
                        : user.bio}
                    </Text>
                  </div>
                  <ul className="about flex flex-col gap-y-4 mt-4">
                    {Object.keys(user)
                      .sort((a, b) =>
                        a.localeCompare(b, "en", {
                          numeric: true,
                          sensitivity: "base",
                        })
                      )
                      .map((key) => {
                        if (
                          user[key] &&
                          (key === "email" ||
                            key === "address" ||
                            key === "gender" ||
                            key === "memberSince")
                        ) {
                          return (
                            <li
                              className="flex gap-4 items-center w-full"
                              key={key}
                            >
                              <span className="text-gray-400 text-lg font-semibold capitalize dark:text-gray-200">
                                {key === "email" && <HiMail />}
                                {key === "gender" && <HiUser />}
                                {key === "memberSince" && <HiUsers />}
                                {key === "address" && <HiLocationMarker />}
                              </span>
                              <Text
                                editable={
                                  canEdit && key !== "memberSince"
                                    ? {
                                        icon: <AiOutlineEdit />,
                                        tooltip: "click to edit text",
                                        onChange: (value) => {
                                          setModifiedUser({
                                            ...modifiedUser,
                                            [key]: value,
                                          });
                                        },
                                      }
                                    : false
                                }
                                className="text-gray-800 truncate font-normal dark:text-gray-200"
                              >
                                {key === "memberSince"
                                  ? "Joined " + moment(user[key]).fromNow()
                                  : canEdit
                                  ? modifiedUser?.[key] || currentUser[key]
                                  : user[key]}
                              </Text>
                            </li>
                          );
                        } else {
                          return null;
                        }
                      })}
                  </ul>
                </div>
                <Divider />
                {canEdit && (
                  <div className="flex w-full flex-col mt-3 gap-3 px-4">
                    <Button
                      disabled={!modifiedUser || ProfileLoading}
                      loading={ProfileLoading}
                      onClick={handlePrfileChange}
                      type="dashed"
                      block
                      className="flex justify-center items-center"
                    >
                      {ProfileLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      onClick={() => setChangePasswordModelVisible(true)}
                      block
                    >
                      Change Password
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
                        title="Are you sure you? 💔 "
                        onConfirm={() => setPasswordModelVisible(true)}
                        okText="Yes 😣"
                        okType="danger"
                        cancelText="Nope 😊"
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
                title="Delete Profile"
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
                  placeholder="Please enter your password"
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                  }}
                />
                {posts.length > 0 && (
                  <>
                    <Divider dashed />
                    <Alert
                      message="Warning"
                      description="Please note! Deleting your account will NOT delete your posts,
                                    If still you will need to delete
                                    them, Do so before deleting your account"
                      type="warning"
                      showIcon
                    />
                  </>
                )}
              </Modal>
              <Modal
                title="Change Password"
                visible={changePasswordModelVisible}
                onCancel={() => {
                  setChangePasswordModelVisible(false);
                }}
                footer={[
                  <Button
                    type="dashed"
                    onClick={() => {
                      setChangePasswordModelVisible(false);
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
                    onClick={HanlePasswordChange}
                  >
                    Submit
                  </Button>,
                ]}
              >
                <div className="flex flex-col gap-y-4">
                  <Input.Password
                    required
                    placeholder="Enter your old password"
                    onChange={(e) => {
                      setChangePasswordData({
                        ...changePasswordData,
                        password: e.target.value,
                      });
                    }}
                  />
                  <Input.Password
                    required
                    placeholder="Enter new password"
                    onChange={(e) => {
                      setChangePasswordData({
                        ...changePasswordData,
                        newPassword: e.target.value,
                      });
                    }}
                  />
                  <Input.Password
                    required
                    placeholder="Re-enter new password"
                    onChange={(e) => {
                      setChangePasswordData({
                        ...changePasswordData,
                        newPasswordConfirm: e.target.value,
                      });
                    }}
                  />
                </div>
              </Modal>
              <motion.div
                layout
                className="md:col-span-1 lg:col-span-2 xl:col-span-3 2xl:col-span-4  pt-4"
              >
                <Tabs defaultActiveKey="1">
                  <TabPane tab={`${user.name?.split(" ")[0]}'s Posts `} key="1">
                    <motion.div
                      layout
                      className="grid gap-4  grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 "
                    >
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
                    <motion.div
                      layout
                      className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                    >
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
