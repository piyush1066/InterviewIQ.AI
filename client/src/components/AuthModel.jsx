import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaTimes } from "react-icons/fa";
import Auth from '../pages/Auth';
import { useState } from 'react';
function AuthModel({ onClose }) {
    const { userData } = useSelector((state) => state.user)
    const [showAuth, setShowAuth] = useState(false)

    useEffect(() => {
        if (userData) {
            onClose()
        }
    }, [userData, onClose])
    return (
        <div className='fixed inset-0 z-[999] flex items-center justify-center bg-black/10 backdrop-blur-sm px-4'>
            <div className='relative w-full max-w-md'>
                <button onClick={() => {
                    console.log("Close clicked");
                    onClose();
                }}
                    className='absolute top-8 right-5 text-gray-800 hover:text-black text-xl'><FaTimes /></button>
            <Auth isModel={true} onClose={onClose} />


        </div>

        </div >
    )
}

export default AuthModel
