import React from "react";
import Calendar from "../Assets/Pic/Calendar.svg";
import Menu from "../Assets/Pic/Menu.svg";
import Bell from "../Assets/Pic/Bell.svg";
import Pic from "../Assets/Pic/Login_pic.svg";
import Logout from "../Assets/Pic/Logout.svg";

const Headear = () => {
  return (
    <>
      <div className=" flex m-2 justify-between  mr-2 ">
        <div className="Head ml-10 ">
          <h2 className="font-medium text-xl">Dashboard</h2>
        </div>
        <div className="flex  gap-10 ">
          <img className="Calendar" src={Calendar} alt="/"></img>

          <img className="Menu" src={Menu} alt="/"></img>

          <img className="Bell" src={Bell} alt="/"></img>

          <img className="pic w-8" src={Pic} alt="/"></img>

          <img className="Logout" src={Logout} alt="/"></img>
        </div>
      </div>
    </>
  );
};

export default Headear;
