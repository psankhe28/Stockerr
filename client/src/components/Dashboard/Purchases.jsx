import React, { useState } from "react";
import { Link } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "../Template/Title.jsx";
import SaleModal from "./SaleModal";
import styles from "./Dashboard.module.css";
import "animate.css";
import Button from "@material-ui/core/Button";
import moment from "moment";

const Purchases = ({ purchasedStocks, loading }) => {
  const [start, setStart] = useState(false);
  const [stock, setStock] = useState(undefined);

  const roundNumber = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  const openSaleModal = (stock) => {
    setStock(stock);
    setStart(true);
  };

  return (
    <React.Fragment>
      {loading ? (
        <h1
          className="animate__animated animate__bounce animate__delay-.2s animate__infinite"
          style={{ margin: "auto", width: "50%", textAlign: "center" }}
        >
          Loading...
        </h1>
      ) : (
        <>
          {purchasedStocks.length > 0 && (
            <div style={{ minHeight: "200px" }}>
              <Title>Stocks in Your Portfolio</Title>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Company Ticker</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price of Purchase</TableCell>
                    <TableCell>Purchase Total</TableCell>
                    <TableCell>Date & Time of Purchase</TableCell>
                    <TableCell align="right">Current Price</TableCell>
                    <TableCell align="right">Current Total</TableCell>
                    <TableCell align="right">Difference</TableCell>
                    <TableCell align="right">Sell</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchasedStocks.map((row) => {
                    const difference =
                      (row.currentPrice - row.purchasePrice) / row.currentPrice;
                    const purchaseTotal =
                      Number(row.quantity) * Number(row.purchasePrice);
                    const currentTotal =
                      Number(row.quantity) * Number(row.currentPrice);
                      const d=row.purchaseDate;
                      const da=moment(d).format('D/M/YYYY h:mma');
                    return (
                      <TableRow key={row.id}>
                        <TableCell>{row.ticker}</TableCell>
                        <TableCell>{row.name || "----"}</TableCell>
                        <TableCell>{row.quantity || "----"}</TableCell>
                        <TableCell>
                          ${row.purchasePrice.toLocaleString() || "----"}
                        </TableCell>
                        <TableCell >
                          $
                          {roundNumber(purchaseTotal).toLocaleString() ||
                            "----"}
                        </TableCell>
                        <TableCell >
                          {da}
                        </TableCell>
                        <TableCell
                          align="right"
                          className={
                            row.currentPrice >= row.purchasePrice
                              ? styles.positive
                              : styles.negative
                          }
                        >
                          ${row.currentPrice.toLocaleString() || "----"}
                        </TableCell>
                        <TableCell
                          align="right"
                          className={
                            currentTotal >= purchaseTotal
                              ? styles.positive
                              : styles.negative
                          }
                        >
                          $
                          {roundNumber(currentTotal).toLocaleString() || "----"}
                        </TableCell>
                        <TableCell
                          align="right"
                          className={
                            difference >= 0 ? styles.positive : styles.negative
                          }
                        >
                          {difference >= 0 ? "▲" : "▼"}{" "}
                          {Math.abs(difference * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          <Link onClick={() => openSaleModal(row)}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              className={styles.reset}
                            >
                              Sale
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {start && stock && (
                <SaleModal setStart={setStart} stock={stock} />
              )}
            </div>
          )}
        </>
      )}
    </React.Fragment>
  );
};

export default Purchases;
