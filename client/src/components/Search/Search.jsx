import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { TextField, Container, Grid, Box, Card } from "@material-ui/core/";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import LineChart from "../Template/LineChart";
import BarChart from "./BarChart";
import styles from "./Search.module.css";
import Axios from "axios";
import InfoCard from "./InfoCard";
import PriceCard from "./PriceCard";
import PurchaseCard from "./PurchaseCard";
import PurchaseModal from "./PurchaseModal";
const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    marginBottom: "40px",
  },
  spin: {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  },

  cssLabel: {
    color: "black",
  },

  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: " !important",
    },
  },
  bg: {
    backgroundColor: "#eee !important",
  },

  cssFocused: {
    color: "black !important",
    paddingBottom: "50% !important",
  },

  notchedOutline: {
    borderWidth: "1px",
    borderColor: "black !important",
  },
}));

const LineChartCard = ({ pastDataPeriod, stockInfo, duration }) => {
  return (
    <Grid
      item
      xs={12}
      sm={7}
      component={Card}
      className={styles.card}
      style={{ minHeight: "350px" }}
    >
      <LineChart
        pastDataPeriod={pastDataPeriod}
        stockInfo={stockInfo}
        duration={duration}
      />
    </Grid>
  );
};

const BarChartCard = ({ sixMonthAverages, stockInfo }) => {
  return (
    <Grid item xs={12} sm component={Card} className={styles.card}>
      <BarChart sixMonthAverages={sixMonthAverages} stockInfo={stockInfo} />
    </Grid>
  );
};

const StockCard = ({ setPurchasedStocks, purchasedStocks, currentStock }) => {
  const { userData } = useContext(UserContext);
  const [selected, setSelected] = useState(false);
  const [stockInfo, setStockInfo] = useState(undefined);
  const [sixMonthAverages, setSixMonthAverages] = useState(undefined);
  const [pastDay, setPastDay] = useState(undefined);
  const [pastMonth, setPastMonth] = useState(undefined);
  const [pastTwoYears, setPastTwoYears] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInfo = async () => {
      setLoading(true);
      const url = `https://stockker-app.herokuapp.com/api/data/prices/${currentStock.ticker}`;
      const response = await Axios.get(url);
      if (response.data.status === "success") {
        setStockInfo(response.data.data);
      }
      setLoading(false);
    };

    getInfo();

    const getData = async () => {
      setLoading(true);
      const url = `https://stockker-app.herokuapp.com/api/data/prices/${currentStock.ticker}/full`;
      const response = await Axios.get(url);
      if (response.data.status === "success") {
        setSixMonthAverages(response.data.sixMonthAverages);
        setPastDay(response.data.pastDay);
        setPastMonth(response.data.pastMonth);
        setPastTwoYears(response.data.pastTwoYears);
      }
      setLoading(false);
    };

    getData();
  }, []);

  return (
    <div className={styles.root}>
      <h1
        className={styles.hideMe}
        style={{
          margin: "auto",
          width: "50%",
          textAlign: "center",
          color: "white",
        }}
      >
        Loading...
      </h1>

      {stockInfo && pastDay && (
        <InfoCard stockInfo={stockInfo} price={pastDay.adjClose} loading />
      )}
      {sixMonthAverages && pastDay && pastMonth && pastTwoYears && (
        <div>
          <Grid container spacing={3}>
            <LineChartCard
              pastDataPeriod={pastTwoYears}
              stockInfo={stockInfo}
              duration={"2 years"}
            />
            <BarChartCard
              sixMonthAverages={sixMonthAverages}
              stockInfo={stockInfo}
            />
          </Grid>
          <PriceCard pastDay={pastDay} />
          <Grid container spacing={3}>
            <PurchaseCard
              setSelected={setSelected}
              balance={userData.user.balance}
            />
            <LineChartCard
              pastDataPeriod={pastMonth}
              stockInfo={stockInfo}
              duration={"month"}
            />
          </Grid>
          {selected && (
            <PurchaseModal
              stockInfo={stockInfo}
              pastDay={pastDay}
              setSelected={setSelected}
              setPurchasedStocks={setPurchasedStocks}
              purchasedStocks={purchasedStocks}
            />
          )}
        </div>
      )}
    </div>
  );
};

const Search = ({ setPurchasedStocks, purchasedStocks, loading }) => {
  const classes = useStyles();
  const [value, setValue] = useState(null);
  const [currentStock, setCurrentStock] = useState(null);

  const onSearchChange = (event, newValue) => {
    setValue(newValue);
    if (newValue) {
      setCurrentStock(newValue);
    } else {
      setCurrentStock(null);
    }
  };

  return (
    <Container className={classes.addMargin}>
      <Autocomplete
        value={value}
        onChange={onSearchChange}
        filterOptions={(options, params) => {
          let filtered = filter(options, params);
          if (currentStock) {
            filtered = filtered.slice(0, 4);
          }
          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="stock-search-bar"
        options={stocks}
        getOptionLabel={(option) => {
          return option.name;
        }}
        renderOption={(option) => option.name}
        style={{
          maxWidth: "700px",
          margin: "30px auto",
          marginBottom: "60px",
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for a stock"
            variant="filled"
            className={classes.bg}
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                focused: classes.cssFocused,
              },
              style: {
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "black",
              },
            }}
          />
        )}
      />
      {loading ? (
        <p style={{ color: "white", marginTop: "70%" }}>Loading...</p>
      ) : (
        <>
          {currentStock && (
            <StockCard
              setPurchasedStocks={setPurchasedStocks}
              purchasedStocks={purchasedStocks}
              currentStock={currentStock}
            />
          )}
        </>
      )}
      <br />
      <br />
      <br />
    </Container>
  );
};

const stocks = [
  { name: "Apple", ticker: "AAPL" },
  { name: "Amazon", ticker: "AMZN" },
  { name: "Google", ticker: "GOOG" },
  { name: "Microsoft", ticker: "MSFT" },
  { name: "Walmart", ticker: "WMT" },
  { name: "Intel", ticker: "INTC" },
  { name: "American Express", ticker: "AXP" },
  { name: "Boeing", ticker: "BA" },
  { name: "Cisco", ticker: "CSCO" },
  { name: "Goldman Sachs", ticker: "GS" },
  { name: "Johnson & Johnson", ticker: "JNJ" },
  { name: "Coca-Cola", ticker: "KO" },
  { name: "McDonald's", ticker: "MCD" },
  { name: "Nike", ticker: "NKE" },
  { name: "Procter & Gamble", ticker: "PG" },
  { name: "Verizon", ticker: "VZ" },
  { name: "Salesforce", ticker: "CRM" },
  { name: "Visa", ticker: "V" },
  { name: "UnitedHealth", ticker: "UNH" },
  { name: "IBM", ticker: "IBM" },
  { name: "Chevron", ticker: "CVX" },
];

export default Search;
