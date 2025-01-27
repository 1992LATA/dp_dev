import React from 'react'
import { LuFolderSearch2 } from "react-icons/lu";
import { FaBars } from "react-icons/fa6";

export const Navbar = () => {
  return (
    <nav className='bg-gray-800 px-4 py-3 flex justify-between ml-64 w-full'>
        <div className='flex items-center text-xl'>
            <FaBars className='text-white me-4 cursor-pointer' />
            <span className='text-white font-semibold'>NHT</span>
        </div>
        <div class name='flex items-center gap-x-5'>
            <div className='relative md: w-65'>
                <span className='relative md:absolute inset-y-0 left-0 flex items-center pl-2'>
                <button className='p-1 focus:outline-none text-white md:text-black'><LuFolderSearch2 /></button> </span>
                <input type='text' className='w-full px-4 py-1 pl-12 rounded shadow outline-none hidden md:block'  />
            </div>
        </div>
    </nav>
  )
}
