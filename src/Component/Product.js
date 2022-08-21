import React from "react";
import Dot from "../Assets/Pic/Dot.svg";

import ReactApexChart from "react-apexcharts";

const Product = () => {
  const series = [
    {
      name: "series1",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
  ];
  const options = {
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  return (
    <>
      <div>
        <div className=" bg-white rounded-lg border  mt-4 mr-5 w-[680px]  "
        style={{ border: "1px solid #93d0e4" }}>
          <ul className='flex  h-12 flex-wrap text-sm font-medium text-center text-gray-500 bg-gray-50 
          rounded-t-lg border-b border-gray-200"'>
            <img className="m-1" src={Dot} alt="/"></img>{" "}
            <p className="mt-2.5 font-semibold">Product Recommdation</p>
          </ul>
          <div className="Graph "> 
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={200}
            width={680}
          />
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
