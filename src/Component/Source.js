import React from 'react'
import  Dot from "../Assets/Pic/Dot.svg";

const Source = () => {
  return (
    <>
         <div className=" bg-white rounded-lg border w-[678px] "
         style={{ border: "1px solid #93d0e4" }}>
              <ul
                className="flex flex-wrap  h-10 text-sm font-medium text-center
                 text-gray-500 bg-gray-50 rounded-t-lg border-b border-gray-200  "
              >
               <img className="m-1" src={Dot} alt="/"></img><p className="mt-2 ml-1 font-semibold text-black">Source Impact</p>
              </ul>
              <div className="p-2 w-[593px]">
                <div className="space-y-2 mt-2">
                    
               <div className='flex'>
                    <p className='text-xs w-20 mt-[-3px]'>Out Bond</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                <div className="bg-blue-400 h-2.5 rounded-full w-[30%]"></div>
               </div>
               </div>
               <div className='flex'>
                    <p className='text-xs w-20 mt-[-3px]'>PR</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                <div className="bg-blue-400 h-2.5 rounded-full w-[75%]"></div>
               </div>
               </div>
               <div className='flex'>
                    <p className='text-xs w-20 mt-[-3px]'>Third Party</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                <div className="bg-blue-400 h-2.5 rounded-full w-[45%]"></div>
               </div>
               </div>
               <div className='flex'>
                    <p className='text-xs w-20 mt-[-3px]'>DSA</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                <div className="bg-blue-400 h-2.5 rounded-full w-[60%]"></div>
               </div>
               </div>
               <div className='flex'>
                    <p className='text-xs w-20 mt-[-3px]'>Google Ads</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                <div className="bg-blue-400 h-2.5 rounded-full w-[33%]"></div>
               </div>
               </div>
               <div className='flex'>
                    <p className='text-xs w-20 mt-[-3px]'>Twitter</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                <div className="bg-blue-400 h-2.5 rounded-full w-[65%]"></div>
               </div>
               </div>
               <div className='flex'>
                    <p className='text-xs w-20 mt-[-3px]'>Instagram</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                <div className="bg-blue-400 h-2.5 rounded-full w-[11%]"></div>
               </div>
               </div>
               <div className='flex'>
                    <p className='text-xs w-20 mt-[-3px]'>Facebook</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
                <div className="bg-blue-400 h-2.5 rounded-full w-[56%]"></div>
               </div>
               </div>
               </div>
              </div>
            </div>
    </>
  )
}

export default Source