import { Avatar, Badge, Button, Dropdown, Menu, message, Space } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { BsMoon, BsSun } from "react-icons/bs";
import Logo from "../assets/img/logo.png";
import { useTheme } from "../contexts/ThemeContext";
import { deleteNotification, SendUserEmailVerification } from "../api";
import { useMediaQuery } from "react-responsive";
import { AiFillBell } from "react-icons/ai";
import { FaUserPlus } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { TiPlus } from "react-icons/ti";
import { AiFillLike } from "react-icons/ai";
import emptyNotification from "../assets/img/noti_empty.svg";
function NavBar() {
  const { currentUser, setCurrentUser, notifications, setNotifications } =
    useAuth();
  const { theme, setTheme } = useTheme();
  const isSmallScreen = useMediaQuery({ query: `(max-width: 550px)` });
  const handleDarkModeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const handleLogOut = () => {
    setCurrentUser(null);
  };
  const HandleEmailVerification = async () => {
    message.loading({
      content: "Sending verification email...",
      key: "sendingEmail",
    });
    try {
      const { data } = await SendUserEmailVerification();
      if (data) {
        message.success({
          content: data.message,
          key: "sendingEmail",
          duration: 3,
        });
      }
    } catch (error) {
      message.error(error);
    }
  };
  const deleteNoticationHandler = useCallback(
    async (id) => {
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
      try {
        const { data } = await deleteNotification(id);
        setNotifications(data.notification);
      } catch (error) {
        message.error(error);
      }
    },
    [notifications, setNotifications]
  );

  const menu = (
    <Menu style={{ minWidth: 250 }}>
      {currentUser && (
        <>
          <Menu.Item key={1} style={{ padding: "0px" }}>
            <Link to={`/${currentUser.username}/profile`}>
              <ul className="p-4 px-10 dark:text-white  text-center flex flex-col justify-center items-center rounded-md ">
                <li>
                  <Avatar size={70}  src={currentUser.avatar} />
                </li>
                <li>{currentUser.name} </li>
                <li>{currentUser.email}</li>
              </ul>
            </Link>
          </Menu.Item>
          {!currentUser.isVerified && (
            <Menu.Item key={2}>
              <div className="flex  justify-center items-center">
                <Button onClick={HandleEmailVerification}>Verify Email</Button>
              </div>
            </Menu.Item>
          )}
          {isSmallScreen && (
            <>
              <Menu.Item key={3}>
                <Link className="text-red" to="/posts">
                  Designs
                </Link>
              </Menu.Item>
              <Menu.Item key={4}>
                <Link to="posts/new">Upload design</Link>
              </Menu.Item>
            </>
          )}
          <Menu.Divider />
          <Menu.Item key={5}>
            <Space style={{ width: "100%" }}>
              <Button onClick={handleLogOut}>Log Out</Button>
              <span>
                <Button
                  type="dashed"
                  shape="circle"
                  icon={theme === "dark" ? <BsSun /> : <BsMoon />}
                  onClick={handleDarkModeChange}
                />
              </span>
            </Space>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  const NotificationMenu = (
    <Menu style={{ minWidth: 250, marginTop: 20 }} selectable={false}>
      {notifications?.map((notification) => (
        <Menu.Item key="1">
          <div className="flex items-center  relative">
            <div className="relative inline-block shrink-0">
              <img
                className="w-10 h-10 rounded-full"
                src={notification.user.avatar}
                alt={notification.user.name}
              />
              <span className="absolute -bottom-2 -right-2 inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white  rounded-full">
                {notification.type === "follow" && <FaUserPlus />}
                {notification.type === "post" && <TiPlus />}
                {notification.type === "like" && <AiFillLike />}
              </span>
            </div>
            <div className="ml-3 text-sm font-normal p-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {notification.user.name}
              </h4>
              <Button
                type="link"
                size="small"
                shape="circle"
                className="absolute  top-0 right-0"
                onClick={() => deleteNoticationHandler(notification.id)}
              >
                <TiDelete />
              </Button>
              <div className="text-sm font-normal">
                {notification.type === "follow" &&
                  "is now following you, Keep going!"}
                {notification.type === "post" &&
                  "Shared New Post, go check it out!"}
                {notification.type === "like" &&
                  "Yahooo! Your post got a new like! from " +
                    notification.user.name}
              </div>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-500">
                {moment(notification._data.date).fromNow()}
              </span>
            </div>
          </div>
        </Menu.Item>
      ))}
      {notifications?.length === 0 && (
        <Menu.Item key={1}>
          <div className="flex p-8 flex-col items-center justify-center  relative">
            <h4 className="text-lg  text-gray-300 dark:text-white/50">
              No Notifications yet
            </h4>
            <img className="" src={emptyNotification} alt="empty" />
          </div>
        </Menu.Item>
      )}
    </Menu>
  );
  return (
    <div className="bg-white shadow-lg shadow-gray-100 dark:shadow-black/20 dark:bg-[#2C3333] text-gray-800  fixed top-0 z-50 dark:text-gray-50 p-3  w-full  ">
      <div className="container mx-auto">
        <div className="flex items-center-justify-between">
          <div className="mr-auto p-2 font-bold text-xl">
            <Link
              to="/posts"
              className="flex gap-4 justify-center items-center"
            >
              <img className="w-10 h-10 rounded-full" src={Logo} alt="logo" />
              Design my ui
            </Link>
          </div>
          <div className="flex gap-4 sm:gap-10 text-sm ml-auto m-0 items-center justify-center mr-0 ">
            {currentUser ? (
              <>
                {!isSmallScreen && (
                  <>
                    <Link to="/posts">Designs</Link>
                    <Link to="posts/new">Upload design</Link>
                  </>
                )}
                <Badge count={notifications?.length} size="small">
                  <Dropdown overlay={NotificationMenu} trigger={["click"]}>
                    <AiFillBell className="text-2xl dark:text-white " />
                  </Dropdown>
                </Badge>
                <Dropdown overlay={menu} trigger={["click"]}>
                  {isSmallScreen ? (
                    <MenuOutlined style={{ fontSize: 20 + "px" }} />
                  ) : (
                    <Avatar src={currentUser.avatar} className=" cursor-pointer " />
                  )}
                </Dropdown>
              </>
            ) : (
              <>
                <Link to="/Login">Login</Link>
                <Link to="/Register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
