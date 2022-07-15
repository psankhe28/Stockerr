import React, { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import styles from "../Template/PageTemplate.module.css";
import {
  Typography,
  IconButton,
  Box,
  Button,
  TextField,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
} from "@material-ui/core";
import { motion } from "framer-motion";
import CloseIcon from "@material-ui/icons/Close";
import Axios from "axios";
import { useHistory } from "react-router-dom";

const SaleModal = ({ setStart, stock }) => {
  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      id="backdrop"
    >
      <Container>
        <motion.div animate={{ opacity: 1, y: -20 }}>
          <SaleModalContent setSaleOpen={setStart} stock={stock} />
        </motion.div>
      </Container>
    </motion.div>
  );
};

const SaleModalContent = ({ setSaleOpen, stock }) => {
  const { userData } = useContext(UserContext);
  const history = useHistory();

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    if (!isNaN(e.target.value) && Number(e.target.value) <= stock.quantity) {
      setQuantity(e.target.value);
    }
  };

  const handleClick = () => {
    setSaleOpen(false);
  };

  const reload = () => {
    window.location.reload();
  };

  const sellStock = async (e) => {
    e.preventDefault();

    const headers = {
      "x-auth-token": userData.token,
    };

    const data = {
      stockId: stock.id,
      quantity: Number(quantity),
      userId: userData.user.id,
      price: Number(stock.currentPrice),
    };

    const url = `https://stockker-app.herokuapp.com/api/stock`;
    const response = await Axios.patch(url, data, {
      headers,
    });

    if (response.data.status === "success") {
      reload();
      setSaleOpen(false);
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Box width="60vh" boxShadow={1}>
        <Card>
          <CardHeader
            style={{ marginTop: "20%" }}
            action={
              <IconButton aria-label="Close" onClick={handleClick}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent>
            <Typography
              component="h1"
              variant="h6"
              align="center"
              style={{ fontWeight: "bold" }}
            >
              Sell
            </Typography>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <span style={{ fontWeight: "bold" }}>Stock name</span>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                disabled
                id="name"
                name="Name"
                autoComplete="Name"
                value={stock.name}
              />
              <span style={{ fontWeight: "bold" }}>Stock price</span>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                disabled
                id="price"
                name="price"
                autoComplete="price"
                value={stock.currentPrice}
              />
              <span style={{ fontWeight: "bold" }}>Stock quantity</span>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="quantity"
                name="quantity"
                autoComplete="quantity"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </form>
            <br />
            <Box display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={styles.confirm}
                onClick={sellStock}
              >
                Confirm
              </Button>
            </Box>

            <br />
            <br />
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
};

export default SaleModal;
