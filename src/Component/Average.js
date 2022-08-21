import React from "react";
import Graph from "../Assets/Pic/Graph.svg";

const Average = () => {
  return (
    <>
      <div className="w-[245px] ">
        <div className="grid  gap-3 m-1 bg-[#FFFFFF]  ">
          <div>
            <h2 className="font-bold">Average</h2>
          </div>

          <div className="bg-[#07617D] rounded-md w-48 h-24 text-white ml-5  font-medium">
            <div className="flex justify-around  mt-5 ">
              <div className="">
                <h4>Today’s Calls </h4>
                <p>1242</p>
              </div>
              <img className="w-10  " src={Graph} alt=""></img>
            </div>
          </div>
          <div className="bg-[#07617D] rounded-md   w-48 h-24 text-white ml-5  font-medium">
            <div className="flex justify-around mt-5 ">
              <div className="">
                <h4>Inbound Calls </h4>
                <p>17</p>
              </div>
              <img className="w-10  " src={Graph} alt=""></img>
            </div>
          </div>
          <div className="bg-[#07617D] rounded-md  w-48 h-24 text-white ml-5  font-medium">
            <div className="flex justify-around mt-5 ">
              <div className="">
                <h4>Outbound Calls</h4>
                <p>86</p>
              </div>
              <img className="w-10  " src={Graph} alt=""></img>
            </div>
          </div>
          <div className="bg-[#07617D] rounded-md  w-48 h-24 text-white ml-5  font-medium">
            <div className="flex justify-around mt-5 ">
              <div className="">
                <h4 className="mr-10">Total sale </h4>
                <p>20 Lacs</p>
              </div>
              <img className="w-10  " src={Graph} alt=""></img>
            </div>
          </div>
          <div className="gap-4">
            <div>
              <h2 className="font-bold">Team Status</h2>
            </div>
            <div className="w-[200px] ml-4 h-64 bg-[#FFFFFF] rounded-lg border ">
              <div
                className="flex flex-wrap text-sm font-medium text-center 
        text-white bg-[#647E98] h-8 rounded-t-lg border-b border-[#F4F4F4]-400"
              >
                <p className="ml-1 mt-1">On Break</p>
              </div>
              <ul className="space-y-3 text-[#5D656B]">
                <li className="">William Jacobson</li>
                <li className="">William Jacobson</li>
                <li className="">William Jacobson</li>
                <li className="">William Jacobson</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Average;
