import React, { useState} from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {usePosts} from "../contexts/PostsContext";
import { Select, Input, Spin, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {addPost } from '../api'
import { message } from 'antd';

const { Option } = Select;
function AddPosts() {
  const {setPosts} = usePosts();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const softwares = [
  <Option value="Figma" key='1' >Figma</Option>,
  <Option value="Adobe XD" key='2'  >Adobe XD</Option>,
  <Option value="Photoshop" key='3' >Adobe Photoshop </Option>,
  <Option value="Illustrator" key='4' >Adobe Illustrator</Option>,
  <Option value="Sketch" key='5' >Sketch</Option>,
];
    const handleFileChange = (e) => {
    const types = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!types.includes(e.target.files[0].type)){
      console.log(e.target.files[0].type)
      e.target.value = null;
      return message.warning('Please upload a valid image file')
    }

    if (e.target.files[0].size > 5000000){
      e.target.value = null;
      return message.warning("The image size is too large " )
    }
    let reader = new FileReader();
    const file = e.target.files[0];
    console.log(file)
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPost({...post, Image: reader.result});
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const postdata = {
      title: post.Title,
      image: post.Image ,
      tags: post.Tags,
      software: post.Software,
      isPrivate: post.isPrivate,
    }
    try {
      const data = await addPost(postdata)
      const { Post } = data;
      message.success("Your Post Was Added Successfully!")
      setPosts(Post);
      Navigate('/posts')
    } catch (error) {
      setLoading(false);
      console.log(error)
      message.error(error);
    }
  };

  
  return (
    <main className='pt-16'>
        <Spin spinning={loading}>
        <Helmet>
            <title>{loading ? 'loading...' : 'Add Post'}</title>
        </Helmet>
      <div className="min-h-screen  py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white dark:bg-gray-900 mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="max-w-md mx-auto">
              <div className="flex items-center space-x-5">
                <div className="h-14 w-14 bg-violet-50  text-gray-400 dark:text-gray-50  dark:bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0]  rounded-full flex flex-shrink-0 justify-center items-center  text-2xl font-mono">
                  <AddPhotoAlternateIcon />
                </div>
                <div className="block pl-2 font-semibold text-xl self-start ">
                  <h2 className="text-xl font-bold dark:text-neutral-100">Share your design!</h2>
                  <p className="text-sm text-gray-500 font-normal leading-tight">Share your designs with anybody who is interested in using them as inspiration or research material.</p>
                </div>
              </div>
              <div className="mt-4">
                {post.Image && <img src={post.Image} alt="Post Thumbnail" className="w-full h-36 shadow-lg object-cover m-auto rounded-3xl" />}
                <form onSubmit={handleSubmit} method="POST " encType="multipart/form-data">
                  <div className="py-8 text-base leading-6 space-y-4  sm:text-lg sm:leading-7">
                    <div className="flex flex-col">
                      <label className="leading-loose">Design Preview</label>
                      <div className="text-ellipsis overflow-hidden">
                        <input
                          required
                          type="file"
                          name="image"
                          accept="image/png, image/gif, image/jpeg"
                          onChange={(e) => { handleFileChange(e)}}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 dark:file:bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0]    dark:file:text-violet-50  hover:file:bg-violet-100"
                        />
                        <p className='text-sm text-gray-400 mt-4'>* Maximum image size is <strong>5 mb</strong></p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="leading-loose">Add a Title</label>
                      <Input required type="text"  placeholder="Post title" allowClear onChange={(e) => setPost({...post, Title: e.target.value})} />
                    </div>
                    <div className="flex flex-col">
                      <label className="leading-loose"> Software :</label>
                      <Select mode="multiple" style={{ width: '100%' }} placeholder="Figma, Adobe XD..." onChange={(e)=>{setPost({...post, Software: e})}}>
                        {softwares}
                      </Select>
                    </div>
                    <div className="flex flex-col">
                      <label className="leading-loose">Choose Some Tags:</label>
                      <Select maxTagTextLength={10} required open={false} allowClear mode='tags' placeholder="Enter a tag and hit enter" onChange={(value) => setPost({...post, Tags: value})} />
                    </div>
                    <div className="flex flex-col">
                      <Checkbox  onChange={(e) => setPost({...post, isPrivate: e.target.checked})} >
                        <span className="text-sm text-gray-400">Keep this post private</span>
                      </Checkbox>
                    </div>
                  </div>
                  <div className="pt-4 flex items-center space-x-4">
                    <button type="submit" disabled={loading} className=" dark:bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0]  bg-gray-200 text-gray-900 flex justify-center items-center w-full dark:text-white px-4 py-3 rounded-full focus:outline-none">
                      {loading ? <Spin className="text-white" /> : 'Submit Your Design'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>


        </Spin>
    </main>
  );
}

export default AddPosts;
