import React from "react";
import Dot from "../Assets/Pic/Dot.svg";

function Tonality() {
  return (
    <>
      <div className=" bg-white rounded-lg border shadow-md mt-4 ">
        <ul
          className="flex  h-12 flex-wrap text-sm font-medium text-center text-gray-500 bg-gray-50 
    rounded-t-lg border-b border-gray-200"
        >
          <img className="m-1" src={Dot} alt="/"></img>{" "}
          <p className="mt-2.5 font-semibold">Tonality Analysis</p>
        </ul>
        <div className="space-y-10 ">
        <button className="border w-20 h-10 border-bg-[#647E98]" >78%</button>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
            <div className="bg-blue-400 h-2.5 rounded-full w-[78%]">
            </div>
            <p className="text-sm">
              Number of decisions recommended during negative tonality
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
            <div className="bg-yellow-400 h-2.5 rounded-full w-[10%]"></div>
            <p className="text-sm">
              Number of decisions recommended to convert the lead
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200">
            <div className="bg-blue-400 h-2.5 rounded-full w-[80%]"></div>
            <p className="text-sm">
              Number of decisions recommended during supervisor escalations
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tonality;
