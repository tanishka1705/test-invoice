import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface Props {
    children: JSX.Element | JSX.Element[] | string | string[] | boolean
}

const Layout = ({ children }: Props) => {
    return (
        <div className='flex'>
            <Sidebar />
            <div className='bg-[#f2f2f2] w-full'>
                <Navbar />
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout