import React, { useEffect, useState } from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparklesSharp } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userScile';
import { useNavigate } from 'react-router-dom';
import { ServerUrl } from '../App';


function Auth({ isModel = false, onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [authError, setAuthError] = useState("");

    useEffect(() => {
        if (userData) {
            if (isModel && onClose) {
                onClose();
            } else if (!isModel) {
                navigate("/");
            }
        }
    }, [userData, navigate, isModel, onClose]);

    const handleGoogleAuth = async () => {
        if (isSigningIn) return;

        setIsSigningIn(true);
        setAuthError("");

        try {
            const response = await signInWithPopup(auth, provider)
            const user = response.user
            const name = user.displayName
            const email = user.email

            if (!name || !email) {
                throw new Error("Google did not provide a name and email address for this account.");
            }

            const result = await axios.post(ServerUrl + "/api/auth/google", { name, email }, { withCredentials: true })
            dispatch(setUserData(result.data))
            if (isModel && onClose) {
                onClose();
            } else {
                navigate("/");
            }
        } catch (error) {
            dispatch(setUserData(null))
            setAuthError(error.response?.data?.message || error.message || "Google sign-in failed. Please try again.");
        } finally {
            setIsSigningIn(false);
        }
    }
    return (
        <div className='w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20'>
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.05 }}
                className={`w-full ${isModel
                    ? "max-w-md p-8 rounded-3xl"
                    : "max-w-lg p-12 rounded-[32px]"
                    } bg-white shadow-2xl border border-gray-200`}
            ><div className='flex items-center justify-center gap-3 mb-6'>
                    <div className="bg-black text-white p-2 rounded-lg">
                        <BsRobot />
                    </div>

                    <h2 className='font-semibold text-lg'>InterviewIQ.AI</h2>

                </div>


                <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
                    Continue with {" "}
                    <span className=' bg-green-100 text-green-600 px-1 py-1 rounded-full inline-flex items-center gap-2'>
                        <IoSparklesSharp size={16} /> AI Smart Interview
                    </span>
                </h1>

                <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8'>
                    Sign in to AI-Powered mock inteviews, track your progress and unlock detailed performance insights.
                </p>
                <motion.button
                    onClick={handleGoogleAuth}
                    disabled={isSigningIn}
                    whileHover={{ opacity: 0.9, scale: 1.03 }}
                    whileTap={{ opacity: 1, scale: 0.98 }}
                    className='w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md disabled:cursor-not-allowed disabled:opacity-70'>
                    <FcGoogle size={20} /> {isSigningIn ? "Signing in..." : "Continue with Google"}
                </motion.button>
                {authError && <p className='mt-4 text-center text-sm text-red-600'>{authError}</p>}

            </motion.div>
        </div >
    )
}

export default Auth
