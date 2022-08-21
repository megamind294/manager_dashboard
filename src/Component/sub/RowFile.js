import React from 'react'
import Tree from '../../Assets/Pic/Tre_Graph.svg';
import Phone from '../../Assets/Pic/Phone.svg';
function RowFile({Name,Percentage,PhoneNo,Image1,Image2}) {
  return (
    <div>
        <div className=''>
          <div className='flex flex-row justify-start gap-5 space-x-3 p-1 ml-4 '>
          <li className='list-none'>{Name}</li>
          <img className='ml- mb-' src={Image1} alt='/'></img>
          <p>{PhoneNo}</p>
          <p className='text-green-400' >{Percentage}</p>
          <img src={Image2} className="" alt='/' ></img>
          </div>
          <hr class="border-1 border-blue-500 cursor-pointer hover:border-red-500 duration-500" /> 
          </div>
    </div>
  )
}

export default RowFile