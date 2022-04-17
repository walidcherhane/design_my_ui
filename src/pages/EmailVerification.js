import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyUserEmailToken } from '../api';
import { useAuth } from '../contexts/authContext';
import {isJWT} from "validator";

function EmailVerification() {
    const {token} = useParams();
    const {setCurrentUser} = useAuth()
    const [error, setError] = useState(null)
    const Navigate = useNavigate();
    useEffect(()=>{
        const isVerified = async ()=>{
            if(!isJWT(token)) {
                setError("Invalid token")
                return
            };
            try {
                const {data} = await verifyUserEmailToken(token)
                if (data.User.isVerified) {
                    setCurrentUser(data.User)
                    message.success(data._message)
                }
            } catch (error) {
                setError(error)
                message.error(error)
            }
        }
        return isVerified()
    }, [token,setCurrentUser])
    setTimeout(() => {
        Navigate('/posts')
    }, 5000);
  return <div className="h-screen flex justify-center items-center">
        {error ? <div className="text-red-800 text-sm font-semibold  capitalize ">{error}</div> : <div  className=' text-sm text-gray-700  '>Verifying your email...</div>}
      </div> ;
}

export default EmailVerification;
