import React from "react";
import Headear from "./Headear";
import Meter from "../Assets/Pic/Meter.svg";
import People from "../Assets/Pic/group.svg";
import Fire from "../Assets/Pic/fire.svg";
import Rocket from "../Assets/Pic/rocket.svg";
import Dot from "../Assets/Pic/Dot.svg";
import Average from "./Average";
import Product from "../Component/Product.js";
import Source from "../Component/Source.js";
import Trending from "../Component/Treding.js";
import Tonality from "../Component/Tonality.js";
import Decision from "../Component/Decision.js";

const Dashboard = () => {
  return (
    <>
      <Headear />
      <div className="flex ">
        {/* Side_Nav */}
        <div className="Side_Nav flex flex-col space-y-10 m-1  mt-8 ">
          <img className="w-8 " src={Meter} alt="/"></img>
          <img className="w-6" src={People} alt="/"></img>
          <img className="w-6" src={Fire} alt="/"></img>
          <img className="w-6" src={Rocket} alt="/"></img>
        </div>
        <div
          className="Average bg-white    w-64 h-auto m-3   flex justify-center mr-12"
 
        >
          <Average />
        </div>
        <div className="mt-2  space-x-1  w-full">
          <button className=" px-6 py-2.5 bg-blue-100 text-blue-800 font-medium text-xs leading-tight uppercase rounded-full focus:bg-gray-300  focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out ">
            All
          </button>
          <button className=" px-6 py-2.5 bg-blue-100 text-blue-800 font-medium text-xs leading-tight uppercase rounded-full hover:bg-blue-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out">
            Customer Support
          </button>
          <button className=" px-6 py-2.5 bg-blue-100 text-blue-800 font-medium text-xs leading-tight uppercase rounded-full hover:bg-blue-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out">
            L2 Desk
          </button>
          <button className=" px-6 py-2.5 bg-blue-100 text-blue-800 font-medium text-xs leading-tight uppercase rounded-full hover:bg-blue-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out">
            Sales
          </button>
          <button className=" px-6 py-2.5 bg-blue-100 text-blue-800 font-medium text-xs leading-tight uppercase rounded-full hover:bg-blue-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out">
            Post Sales Support
          </button>
          <button className=" px-6 py-2.5 bg-blue-100 text-blue-800 font-medium text-xs leading-tight uppercase rounded-full hover:bg-blue-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg transition duration-150 ease-in-out">
            Claims
          </button>

          <div className="sales flex mt-5 ">
            <div
              className=" bg-white rounded-lg  h-64 mr-8 "
              style={{ border: "1px solid #93d0e4" }}
            >
              <ul
                className="flex flex-wrap w-80 h-10 text-sm font-medium text-center
                 text-gray-500 bg-gray-50 rounded-t-lg border-b border-gray-200  "
              >
                <img className="m-1" src={Dot} alt="/"></img>
                <p className="mt-2 ml-1 font-semibold text-black">
                  Sales Insight
                </p>
              </ul>
              <div className="p-1 text-[#647E98] ">
                Total Sales
                <p className="text-black">1000</p>
                <div className="space-y-8 mt-8 ">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-[#07617D]">
                    <div className="bg-[#07617D] h-2.5 rounded-full w-[100%]">
                      <div className="bg-yellow-300 h-2.5 rounded-full w-[30%]"></div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-[#07617D]">
                    <div className="bg-[#07617D] h-2.5 rounded-full w-[100%]">
                      <div className="bg-yellow-300 h-2.5 rounded-full w-[20%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" bg-white rounded-lg border" 
            style={{ border: "1px solid #93d0e4" }}>
              <ul
                className="flex flex-wrap w-80 h-10 text-sm font-medium text-center
                 text-gray-500 bg-gray-50 rounded-t-lg border-b border-gray-200  "
              >
                <img className="m-1" src={Dot} alt="/"></img>
                <p className="mt-2 ml-1 font-semibold text-black">Sales</p>
              </ul>
              <div className="p-1 text-[#647E98]">
                Total Sales
                <p className="text-black">1000</p>
                <div className="space-y-8 mt-8">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 ">
                    <div className="bg-blue-600 h-2.5 rounded-full w-[70%]"></div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full w-[20%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <Product />
          </div>
          <div className="mt-2  p-1">
            <Source />
          </div>
        </div>
        <div>
          <Trending />

          {/* <Decision /> */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
