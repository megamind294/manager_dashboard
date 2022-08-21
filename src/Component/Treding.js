import React from "react";
import Dot from "../Assets/Pic/Dot.svg";
import Phone from "../Assets/Pic/Phone.svg";
import Tree from "../Assets/Pic/Tre_Graph.svg";

const Treding = () => {
  return (
    <>
      <div className=" bg-white rounded-lg border mt-16 w-[421px] h-[257px]  "
      style={{ border: "1px solid #93d0e4" }}>
        <ul
          className='flex  h-12 flex-wrap text-sm font-medium text-center text-gray-500 bg-gray-50 
          rounded-t-lg border-b border-gray-200"'
        >
          <img className="m-1" src={Dot} alt="/"></img>
          <p className="mt-2.5 font-semibold">Trending</p>
        </ul>
        {/* <div className=''>
          <div className='flex flex-row justify-start gap-5 space-x-3 p-1 ml-4 '>
          <li className='list-none'>Insurance Policy</li>
          <img className='ml- mb-' src={Phone} alt='/'></img>
          <p>73</p>
          <p className='text-green-400' >73%</p>
          <img src={Tree} className="" alt='/' ></img>
          </div>
          <hr class="border-1 border-blue-500 cursor-pointer hover:border-red-500 duration-500" /> 
          </div>

          <div className=''>
          <div className='flex flex-row justify-start gap-[38px]  p-1 ml-4'>
          <li className='list-none'>Inquiry Calls</li>
          <img className='ml-[20px] mb-' src={Phone} alt='/'></img>
          <p className='mr-[-9px]'>23</p>
          <p className='text-green-400' >23%</p>
          <img src={Tree} className="" alt='/' ></img>
          </div>
          <hr class="border-1 border-blue-500 cursor-pointer hover:border-red-500 duration-500" /> 
          </div>
          <div className=''>
          <div className='flex flex-row justify-start gap-10 p-1 ml-4'>
          <li className='list-none'>Maturing Date</li>
          <img className='ml- mb-' src={Phone} alt='/'></img>
          <p>88</p>
          <p className='text-green-400 ml-[-10px]' >88%</p>
          <img src={Tree} className="" alt='/' ></img>
          </div>
          <hr class="border-1 border-blue-500 cursor-pointer hover:border-red-500 duration-500" /> 
          </div>
          <div className=''>
          <div className='grid grid-cols-5 ml-5'>
          <li className='list-none'>Product B</li>
          <img className='' src={Phone} alt='/'></img>
          <p>81</p>
          <p className='text-red-400' >10%</p>
          <img src={Tree} className="" alt='/' ></img>
          </div>
          <hr class="border-1 border-blue-500 cursor-pointer hover:border-red-500 duration-500" /> 
          </div>
          <div className=''>
          <div className='flex flex-row justify-start gap-10 p-1 ml-4 '>
          <li className='list-none'>Cancellation Calls</li>
          <img className='ml- mb-' src={Phone} alt='/'></img>
          <p>22</p>
          <p className='text-green-400' >22%</p>
          <img src={Tree} className="" alt='/' ></img>
          </div>
          </div> */}

        <div className=" p-2 ">
          <table
            class="table-auto "
            style={{ width: "-webkit-fill-available" } }
          >
            <tbody className="">
              <tr className=" border-b">
                <td>Insurance Policy</td>
                <td>
                  <img className="" src={Phone} alt="/"></img>
                </td>
                <td>
                  <p>73</p>{" "}
                </td>
                <td>
                  <p className="text-green-400">73%</p>
                </td>
                <td>
                  <img src={Tree} className="" alt="/"></img>
                </td>
              </tr>
              {/* <hr className="border-1  border-blue-500 " /> */}
              <tr className=" border-b">
                <td>Inquiry Calls</td>
                <td>
                  <img className="" src={Phone} alt="/"></img>
                </td>
                <td>
                  <p>23</p>
                </td>
                <td>
                  <p className="text-green-400">23%</p>
                </td>
                <td>
                  <img src={Tree} className="" alt="/"></img>
                </td>
              </tr>
              {/* <hr class="border-1 border-blue-500 cursor-pointer" /> */}
              <tr className=" border-b">
                <td>Maturing Date of Policy</td>
                <td>
                  <img className="" src={Phone} alt="/"></img>
                </td>
                <td>
                  <p>88</p>
                </td>
                <td>
                  <p className="text-green-400">88%</p>
                </td>
                <td>
                  <img src={Tree} className="" alt="/"></img>
                </td>
              </tr>
              {/* <hr class="border-1 border-blue-500 cursor-pointer" /> */}
              <tr className=" border-b">
                <td>Product B</td>
                <td>
                  <img className="" src={Phone} alt="/"></img>
                </td>
                <td>
                  <p>81</p>
                </td>
                <td>
                  <p className="text-red-400">10%</p>
                </td>
                <td>
                  <img src={Tree} className="" alt="/"></img>
                </td>
              </tr>
              {/* <hr class="border-1 border-blue-500 cursor-pointer " /> */}
              <tr className=" border-b">
                <td>Cancellation Calls</td>
                <td>
                  <img className="" src={Phone} alt="/"></img>
                </td>
                <td>
                  <p>22</p>
                </td>
                <td>
                  <p className="text-green-400">22%</p>
                </td>
                <td>
                  <img src={Tree} className="" alt="/"></img>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Treding;
