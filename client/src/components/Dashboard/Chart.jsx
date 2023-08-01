import React, { useState, useEffect } from "react";
import Title from "../Template/Title.jsx";
import LineChart from "../Template/LineChart";
import Axios from "axios";
import "animate.css";
const Chart = () => {
  const [chartData, setChartData] = useState(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const url = `https://stockker-app.herokuapp.com/api/data/random`;
      const response = await Axios.get(url);
      if (response.data.status === "success") {
        setChartData(response.data);
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <>
          <h1 className="animate__animated animate__bounce animate__delay-.2s animate__infinite" style={{margin:"auto",width:"50%",textAlign:"center"}}>
            Loading...
          </h1>
        </>
      ) : (
        <>
          {chartData && (
            <div style={{ minHeight: "240px" }}>
              <Title>Explore {chartData.name}'s Stock Chart</Title>
              <LineChart
                pastDataPeriod={chartData.data}
                stockInfo={{ ticker: chartData.ticker }}
                duration={"3 years"}
              />
            </div>
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default Chart;
