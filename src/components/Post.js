import React, { useState } from "react";
import { Avatar, Badge, message  } from "antd";
import moment from "moment";
import { BsFillHeartFill, BsHeart } from "react-icons/bs";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import { likePost, handlePostSave } from "../api";
import { LoadingOutlined } from "@ant-design/icons";
import { usePosts } from "../contexts/PostsContext";
import { useAuth } from "../contexts/authContext";
import {motion} from 'framer-motion'
function Post({ post }) {
  const [loading, setLoading] = useState({ like: false, save: false });
  const { likedPosts, setLikedPosts, savedPosts, setSavedPosts } = usePosts();
  const {onlineUsers} = useAuth()

  

  const handlePostLike = async (postId) => {
    setLoading({ ...loading, like: true });
    try {
      
      const { data } = await likePost(postId);
      setLoading({ ...loading, like: false });
      setLikedPosts(data.likedPosts)

    } catch (error) {
      setLoading({ ...loading, like: false });
      message.error(error);
    }
  };
  const handlePostsave = async (postId) => {
    setLoading({ ...loading, save: true });
    try {
      const { data } = await handlePostSave({ Post: postId });
      setLoading({ ...loading, save: false });
      setSavedPosts(data.savedPosts)
    } catch (error) {
      setLoading({ ...loading, save: false });
      message.error(error);
    }
  };
  return (
    <>
      <motion.div layout className={` post--card w-full flex flex-col gap-4 p-2 bg-gray-300/10 dark:bg-gray-700/10 shadow-2xl shadow-gray-400/20 dark:shadow-gray-900/20 rounded-xl max-w-sm mx-auto relative   dark:text-white `}>
        <div className="w- relative text-start flex justify-start items-center gap-4">
          <div className=" ">
                  <Badge dot={onlineUsers?.some((user)=> user.username === post.Author.username)} status="success">
                    <Avatar shape="circle" src={post.Author.avatar} onError={
                      (e) => {
                        e.target.src =
                          "https://res.cloudinary.com/dzfqnqwzk/image/upload/v1598584943/avatar_default_yqj0fj.png";
                      }
                    } />
                  </Badge>
          </div>
          <Link to={`/${post.Author.username}/profile`} className="text-gray-900  ">
            {post.Author.username} <br />
            <div className="text-sm text-gray-500 dark:text-gray-200 font-light">
              {post.Author.name} 
            </div>
          </Link>
              {post.isPrivate && (
                <div className="absolute top-2 right-0  bg-gray-200 dark:bg-gray-700/50 dark:text-gray-200 text-gray-600 text-sm p-1 px-3 rounded-full  border-[1px] border-gray-300 dark:border-gray-900 ">
                    Private
                </div>
              )  
              }
        </div>

        <div className="post--card__img relative rounded-xl overflow-hidden  bg-gray-50 ">
        <Link to={`/posts/${post._id} `} className="peer " >          
          <img
            src={post.Image}
            className=" z-0 hover:scale-125 min-h-[219px] dark:bg-gray-800 bg-gray-300 transition duration-500 object-cover object-center h-full w-full "
            alt={post.Title}
          />
        </Link>
          <div className="absolute post--cart__footer opacity-0 peer-hover:opacity-100 hover:opacity-100 transition duration-200 flex z-10 bottom-0 inset-x-0 p-4 bg-gradient-to-t  from-gray-900/80 to-transparent   text-white">
            <div className=" w-[90%] ">
              <div className="  text-base  font-bold  truncate ">
                {post.Title}
              </div>
              <div className="text-sm font-light">
                {moment(post.Date).fromNow()}
              </div>
            </div>
            <div className="mt-auto flex gap-2 flex-grow ">
              <button
                disabled={loading.like}
                onClick={() => {
                  handlePostLike(post._id);
                }}
              >
                {loading.like ? (
                  <LoadingOutlined />
                ) : likedPosts?.some((p)=> String(p._id) === String(post._id)) ? (
                  <BsFillHeartFill />
                ) : (
                  <BsHeart />
                )}
              </button>
              <button
                disabled={loading.save}
                onClick={() => {
                  handlePostsave(post._id);
                }}
              >
                {loading.save ? (
                  <LoadingOutlined />
                ) : savedPosts?.some((id)=> id === String(post._id)) ? (
                  <FaBookmark />
                ) : (
                  <FaRegBookmark />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Post;
