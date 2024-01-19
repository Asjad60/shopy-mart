import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const SupplierChart = ({ products }) => {
  const [chartData, setChartData] = useState("buyers");

  const getRandomColor = (colorLength) => {
    const colors = [];
    for (let i = 0; i < colorLength; i++) {
      const randomColor = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
        Math.random() * 256
      )},${Math.floor(Math.random() * 256)})`;
      colors.push(randomColor);
    }
    return colors;
  };

  // data for buyer
  const chartDataForBuyers = {
    labels: products.map((product) => product.productName),
    datasets: [
      {
        data: products.map((product) => product.totalBuyers),
        backgroundColor: getRandomColor(products.length),
      },
    ],
  };

  const chartDataForIncome = {
    labels: products.map((product) => product.productName),
    datasets: [
      {
        data: products.map((product) => product.totalPrice),
        backgroundColor: getRandomColor(products.length),
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
  }

  return (
    <div className="flex flex-1 flex-col rounded-md bg-[#161d29] p-4">
      <p className="text-xl font-medium mb-2">Visualize</p>
      <div className={`flex gap-x-5 `}>
        <button
          onClick={() => setChartData("buyers")}
          className={`p-2 rounded-md ${chartData === "buyers" && "text-yellow-400 bg-[#2c333f]"}`}
        >
          Buyers
        </button>
        <button
          onClick={() => setChartData("income")}
          className={`p-2 rounded-md ${chartData === "income" && "text-yellow-400 bg-[#2c333f]" }`}
        >
          Income
        </button>
      </div>

      <div className="mx-auto h-full w-full ">
        <Pie
          data={
            chartData === "buyers" ? chartDataForBuyers : chartDataForIncome
          }
          options={options}
        />
      </div>
    </div>
  );
};

export default SupplierChart;
