import React, { useEffect, useState } from "react";
import {
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiAdobexd,
  SiFigma,
  SiSketch,
} from "react-icons/si";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePalette } from "react-palette";
import {
  Checkbox,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Tooltip,
} from "antd";
import { useAuth } from "../contexts/authContext";
import { Helmet } from "react-helmet-async";
import { deletePost, editPost, getPost } from "../api";
import { HeartTwoTone, EyeTwoTone } from "@ant-design/icons";
import { Avatar } from "@mui/material";
import moment from "moment";
import axios from "axios";
import fileDownload from "js-file-download";
import sound from "../assets/sounds/5fa5e3b3b18812639b8ece5436f7a280.m4a";
import { AnimatePresence, motion } from "framer-motion";
import Dragger from "antd/lib/upload/Dragger";
const { Option } = Select;
function Post() {
  const { id } = useParams();
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isEditModelVisible, setIsEditModelVisible] = useState(false);
  const [modifiedPost, setModifiedPost] = useState({});
  const { currentUser } = useAuth();
  const Navigate = useNavigate();
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data } = await getPost(id);
        setPost({ ...data.Post, likes: data.likes });

        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error(error);
        Navigate("/posts");
      }
    };
    fetchPost();
  }, [id, Navigate]);
  const { data } = usePalette(post.Image);
  const color = Object.keys(data).map(function (key) {
    return data[key];
  });
  const handleCopy = (e) => {
    navigator.clipboard.writeText(e.target.innerText);
    const copySound = new Audio(sound);
    copySound.play();
    message.success(`Color code copied to clipboard`, 4);
  };

  const to64bitImage = async (file) => {
    var reader = new FileReader();
    reader.onloadend = function () {
      setModifiedPost({ ...modifiedPost, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handlePostDelete = async () => {
    setLoading(true);
    try {
      const { data } = await deletePost(id);
      const { msg, success } = data;
      if (success) {
        message.success(msg);
        Navigate("/posts");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error);
      console.log(error);
    }
  };
  const handlePostEdit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const _data = {
      id: post._id,
      modifiedPost,
    };
    try {
      const { data } = await editPost(_data);
      setLoading(false);
      if (data.post) {
        setPost(data.post);
        message.success(data.msg);
        setIsEditModelVisible(false);
      }
    } catch (error) {
      setLoading(false);
      message.error(error);
    }
  };
  const handleDownload = (url, name) => {
    axios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, name + ".jpeg");
      });
  };
  return (
    <div className="pt-[50px]">
      {post?.Author?.id === currentUser?._id && (
        <Modal
          width={700}
          title="Edit Post"
          visible={isEditModelVisible}
          onOk={handlePostEdit}
          confirmLoading={loading}
          okText="Update"
          cancelText="Cancel"
          onCancel={() => {
            setIsEditModelVisible(false);
          }}
        >
          <div className=" flex gap-4 flex-wrap w-full p-4">
            <div className="flex flex-grow gap-x-10 flex-col ">
              <label htmlFor="phone">Title</label>
              <Input
                onChange={(e) => {
                  setModifiedPost({ ...modifiedPost, title: e.target.value });
                }}
                defaultValue={post.Title}
                name="title"
                type="text"
                placeholder="Enter your design title here"
              />
            </div>

            <div className="flex flex-grow gap-x-10 flex-col ">
              <label htmlFor="altemail">Software</label>
              <Select
                mode="multiple"
                defaultValue={post.Software}
                style={{ width: "100%" }}
                placeholder="Figma, Adobe XD..."
                onChange={(value) => {
                  setModifiedPost({ ...modifiedPost, software: value });
                }}
              >
                <Option value="Figma" key="1">
                  Figma
                </Option>
                ,
                <Option value="Adobe XD" key="2">
                  Adobe XD
                </Option>
                ,
                <Option value="Photoshop" key="3">
                  Adobe Photoshop{" "}
                </Option>
                ,
                <Option value="Illustrator" key="4">
                  Adobe Illustrator
                </Option>
                ,
                <Option value="Sketch" key="5">
                  Sketch
                </Option>
                ,
              </Select>
            </div>
            <div className="flex flex-grow gap-x-10  flex-col ">
              <label htmlFor="adress">Tags</label>
              <Select
                maxTagTextLength={10}
                required
                open={false}
                defaultValue={post.Tags}
                allowClear
                mode="tags"
                placeholder="Enter a tag and hit enter"
                onChange={(value) => {
                  setModifiedPost({ ...modifiedPost, tags: value });
                }}
              />
            </div>

            <div className="flex w-full flex-grow flex-col">
              <label className="leading-loose">Design Preview</label>
              <Dragger
                name="image"
                onChange={(info) => {
                  to64bitImage(info.file);
                }}
                beforeUpload={() => {
                  return false;
                }}
                accept={"image/*"}
                maxCount={1}
                showUploadList={true}
              >
                <p className="ant-upload-text">
                  Click or drag image to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Only .jpeg, .jpg, .png, .gif files are allowed max size: 5MB
                </p>
              </Dragger>
            </div>
            <div className="flex mt-4 flex-col">
              <Checkbox
                defaultChecked={post.isPrivate}
                onChange={(e) => {
                  setModifiedPost({
                    ...modifiedPost,
                    isPrivate: e.target.checked,
                  });
                }}
              >
                <span className="text-sm text-gray-400">
                  Make this post private
                </span>
              </Checkbox>
            </div>
          </div>
        </Modal>
      )}
      <AnimatePresence>
        {isZoomed && (
          <>
            <motion.div
              key={post.Image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsZoomed(false)}
              className="fixed cursor-zoom-out  z-[99999999999] flex filter backdrop-blur-sm  justify-center bg-gray-900/50 inset-0 h-screen"
            >
              <img className="-full object-contain " src={post.Image} alt="" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="mx-auto">
        <div className="grid gap-y-3   grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 mt-6 content-start ">
          {loading ? (
            <>
              <div className="col-span-4 h-screen flex justify-center items-center ">
                <Spin size="middle" tip="Loading..." />
              </div>
            </>
          ) : (
            <>
              <Helmet>
                <title>
                  {post.Author === undefined
                    ? "loading..."
                    : `Post by: ${post.Author?.name}  `}{" "}
                </title>
              </Helmet>
              <div
                style={{ backgroundColor: data.lightVibrant }}
                className={` relative  col-span-2 px-10 flex justify-center items-start`}
              >
                <img
                  className="h-full   cursor-zoom-in  filter drop-shadow-xl   object-contain  max-w-lg mx-auto min-w-full "
                  src={post.Image}
                  alt={post.Title}
                  onClick={() => setIsZoomed(true)}
                />
                <div className="   lg:absolute flex gap-4 flex-col my-auto lg:flex-row   lg:top-4 lg:right-4   ">
                  {post.Software &&
                    post.Software.map((software) => (
                      <div
                        className="flex items-center gap-4 lg:bg-gray-50/80 dark:lg:bg-blue-900/80 rounded-full  p-2  "
                        key={software}
                      >
                        <Avatar sx={{ bgcolor: "#e1f5fe", color: " #0288d1 " }}>
                          {software === "Figma" && <SiFigma />}
                          {software === "Adobe XD" && <SiAdobexd />}
                          {software === "Photoshop" && <SiAdobephotoshop />}
                          {software === "Illustrator" && <SiAdobeillustrator />}
                          {software === "Sketch" && <SiSketch />}
                        </Avatar>
                        <div className="hidden lg:block">{software}</div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex  relative flex-col p-5 sm:col-span-2 lg:col-span-1 bg-gray-100 dark:bg-gray-900">
                {post.Author && (
                  <>
                    <div className="flex justify-between items-center gap-x-4 border-b border-gray-300 pb-4 overflow-hidden">
                      <div className="flex gap-4 items-center ">
                        <img
                          src={post.Author.avatar}
                          alt=""
                          height="48"
                          width="48"
                          className=" md:h-auto max-w-[100px] max-h-[100px] object-cover md:bg-white dark:md:bg-[#2d3436] rounded-full"
                        />
                        <div className="text-xl text-center capitalize  text-gray-500 dark:text-gray-50 truncate">
                          <Link
                            to={
                              post.Author.username
                                ? `/${post.Author.username}/profile`
                                : "#"
                            }
                          >
                            {post.Author.name || "Anonymous User"}
                          </Link>
                        </div>
                      </div>
                      <div className=" flex gap-4">
                        {post.likes?.length > 0 && (
                          <div className="ml-auto mr-2 text-center flex flex-col gap-y-2 text-sm">
                            <span>
                              <HeartTwoTone style={{ fontSize: "20px" }} />
                            </span>
                              <span> {post.likes?.length} </span>
                          </div>
                        )}
                        {post.Views?.length > 0 && (
                          <div className="ml-auto mr-2 text-center flex flex-col gap-y-2 text-sm">
                            <span>
                              <EyeTwoTone style={{ fontSize: "20px" }} />
                            </span>
                            <span> {post.Views?.length} </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div className="mt-4">
                  <h3 className="text-gray-700  dark:text-gray-200  capitalize text-xl font-bold mb-0  ">
                    {post.Title}
                  </h3>
                  <span className="text-gray-500 dark:text-gray-100   mt-1">
                    {moment(post.Date, "MM/DD/YYYY hh:mm a").fromNow()}
                  </span>{" "}
                  <br />
                  <div className="flex flex-wrap gap-2 mt-6">
                    <button
                      disabled={loading}
                      onClick={() => {
                        handleDownload(post.Image, post.Title);
                      }}
                      className="flex-grow px-8 py-4 bg-white dark:bg-gray-700 dark:text-white  text-lg font-bold hover:shadow-xl shadow-gray-50 dark:shadow-gray-900 rounded-xl   focus:outline-none focus:bg-gray-50 transition duration-200"
                    >
                      Download Now
                    </button>
                    {post?.Author?.id === currentUser?._id && (
                      <>
                        <button
                          onClick={() => {
                            setIsEditModelVisible(true);
                          }}
                          className="flex-grow px-8 py-4 bg-white dark:bg-gray-700 dark:text-white  text-lg font-bold hover:shadow-xl shadow-gray-50 dark:shadow-gray-900 rounded-xl   focus:outline-none focus:bg-gray-50 transition duration-200"
                        >
                          Edit
                        </button>
                        <Popconfirm
                          title="Are you sure you want to delete this post?"
                          onConfirm={handlePostDelete}
                          okText="Delete"
                          okType="danger"
                        >
                          <button className="flex-grow px-8 py-4 transition duration-200 text-red-600 text-sm font-normal rounded-xl hover:bg-red-500 hover:text-red-100 bg-red-100 dark:text-red-100 dark:bg-red-900/50  focus:outline-none ">
                            Delete Post
                          </button>
                        </Popconfirm>
                      </>
                    )}
                  </div>
                  <div className="bg-white dark:bg-gray-900 dark:text-gray-100 border rounded-xl p-5 mt-5">
                    <div className="text-center  font-bold capitalize text-2xl">
                      Colors Pallet
                    </div>
                    <p className="text-center text-gray-600 text-sm">
                      Click the color to copy code.
                    </p>
                    <div className="flex  flex-wrap gap-0 mt-5 justify-around  md:px-5 ">
                      {color &&
                        color.map((key) => (
                          <div
                            key={key}
                            className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-full gap-2 p-2 pr-4 mt-4 border "
                          >
                            <Avatar
                              sx={{
                                bgcolor: key,
                                color: key,
                                width: 24,
                                height: 24,
                              }}
                            />
                            <span
                              onClick={(e) => {
                                handleCopy(e);
                              }}
                            >
                              {key}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="flex justify-center flex-wrap gap-2 mt-6">
                    {post.Tags &&
                      post.Tags.map((tag) => (
                        <div
                          key={tag + Math.random()}
                          className="bg-gray-200 dark:bg-gray-800 dark:text-gray-200 text-gray-600 font-medium p-2 px-3 rounded-full  border-[1px] border-gray-300 "
                        >
                          #{tag}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
