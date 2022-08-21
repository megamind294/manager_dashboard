import React from 'react'
import  Dot from "../Assets/Pic/Dot.svg";

function Decision() {
  return (
    <>
    <div className='w-full bg-white rounded-lg border shadow-md mt-4'>
        <ul
    className='flex  h-12 flex-wrap text-sm font-medium text-center text-gray-500 bg-gray-50 
    rounded-t-lg border-b border-gray-200'
  >
    <img className="m-1" src={Dot} alt="/"></img>{" "}
    <p className="mt-2.5 font-semibold">Types of Decision</p>
  </ul>
  </div>
  </>
  )
}

export default Decision