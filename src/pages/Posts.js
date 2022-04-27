import React, { useEffect, useState } from "react";
import { usePosts } from "../contexts/PostsContext";
import { BackTop, Empty, Input, message, Radio, Spin } from "antd";
import { Helmet } from "react-helmet-async";
import { getPosts, searchPosts } from "../api";
import Post from "../components/Post";
import { isEmpty } from "validator";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import AnimateOnView from "../components/AnimateOnView";
import { motion } from "framer-motion";
const { Search } = Input;
function Posts() {
  const [sortPref, setSortPref] = useState(
    localStorage.getItem("sortPref") || "likes"
  );
  const { posts, setPosts } = usePosts();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      try {
        const { data } = await getPosts(sortPref);
        setPosts(data.Posts);
        setLoading(false);
        localStorage.setItem("sortPref", sortPref);
      } catch (error) {
        setLoading(false);
        message.error(error);
      }
    };
    return fetchPosts();
  }, [setPosts, sortPref]);

  const handleSearch = async (searchQuery) => {
    if (isEmpty(searchQuery, { ignore_whitespace: true })) {
      searchQuery = "fetch_all";
    }
    setLoading(true);
    try {
      const { data } = await searchPosts(searchQuery);
      setPosts(data.Posts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error);
    }
  };

  return (
    <main className="pt-20 ">
      <Helmet>
        <title>{loading ? "loading..." : "Posts"}</title>
      </Helmet>
      <BackTop>
        <div className="ant-back-top-inner text-3xl transition  text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-100 ">
          <BsFillArrowUpCircleFill />
        </div>
      </BackTop>
      <div className="container mx-auto relative">
        <div className="flex flex-col gap-8 md:flex-row w-full justify-between  items-center   sm:mx-auto my-3  ">
          <div className="w-11/12  md:w-1/2">
            <Search
              className="text-white"
              placeholder="Enter any keyword to search (eg: tag, username, post title or by software)"
              onChange={(event)=>{handleSearch(event.target.value)}}
              loading={loading}
              enterButton
            />
          </div>

          <Radio.Group
            className="flex flex-wrap gap-2 justify-center"
            onChange={(e) => setSortPref(e.target.value)}
            defaultValue={sortPref}
            disabled={loading}
          >
            <Radio.Button value="likes">Sort By Likes</Radio.Button>
            <Radio.Button value="Date">Sort By Newest</Radio.Button>
            <Radio.Button value="Views">Sort By views</Radio.Button>
          </Radio.Group>
        </div>
            <motion.div
              layout
              className=" h-screen grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  mt-14  content-start "
            >
              {posts?.map((post) => (
                <AnimateOnView key={post._id}>
                  <Post post={post} />
                </AnimateOnView>
              ))}
              {posts?.length === 0 && !loading  && (
                <div className="col-span-full  flex items-center justify-center">
                  <Empty />
                </div>
              )}
              {posts?.length === 0 && loading && (
                <div className="col-span-4 absolute t-1/2 inset-x-1/2 ">
                  <Spin size="middle" tip="Loading..." />
                </div>
              )}
            </motion.div>

      </div>
    </main>
  );
}

export default Posts;
