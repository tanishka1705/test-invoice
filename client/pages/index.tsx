import Login from '@/components/auth/Login'
import React from 'react'

const Home = () => {
  return (
    <div className='bg-[#f2f2f2] h-screen flex justify-center items-center'>
      <div className='bg-[#fff] grid grid-cols-2 w-3/4 shadow-sm p-4'>
        <div className='flex flex-col justify-center items-center'>
          <h1 className='text-4xl font-bold mt-8'>Welcome Back</h1>
          <p className='text-center text-stone-500 p-4'>Hi there! We’re so glad you’re here! We’ve got something for you.
            Let’s go!</p>
          <img src="/images/login.png" alt="" className='w-3/4' />
        </div>
        <div className='flex flex-col justify-center px-8 py-4'>
          <Login />
        </div>
      </div>
    </div>
  )
}

export default Home