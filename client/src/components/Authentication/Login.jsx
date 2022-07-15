import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  CssBaseline,
  Button,
  Card,
  CardContent,
  Grid,
  Link,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./Auth.module.css";

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

const Login = () => {
  const history = useHistory();
  const { setUserData } = useContext(UserContext);
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onChangeUsername = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
  };

  const onChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const newUser = { username, password };
    const url = "https://stockker-app.herokuapp.com/api/auth/login";
    const loginRes = await axios.post(url, newUser);

    if (loginRes.data.status === "fail") {
      setUsernameError(loginRes.data.message);
      setPasswordError(loginRes.data.message);
    } else {
      setUserData(loginRes.data);
      localStorage.setItem("auth-token", loginRes.data.token);
      history.push("/dashboard");
    }
  };

  return (
    <div className={styles.background}>
      <CssBaseline />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Box width="70vh" boxShadow={1}>
          <Card className={styles.paper}>
            <CardContent>
              <Typography
                component="h1"
                variant="h5"
                style={{ textAlign: "center" }}
                className={styles.title}
              >
                Login
              </Typography>
              <form className={styles.form} onSubmit={onSubmit}>
                <span style={{fontWeight:"bold"}}>Username <span style={{color:"red"}}>*</span></span>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  autoComplete="username"
                  error={usernameError.length > 0 ? true : false}
                  helperText={usernameError}
                  value={username}
                  onChange={onChangeUsername}
                />
                <span style={{fontWeight:"bold"}}>Password <span style={{color:"red"}}>*</span></span>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  placeholder="Enter your password"
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={passwordError.length > 0}
                  helperText={passwordError}
                  value={password}
                  onChange={onChangePassword}
                />
                <Box display="flex" justifyContent="center">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={styles.submit}
                  >
                    Login
                  </Button>
                </Box>
              </form>
              <Grid container justify="center">
                <Grid item>
                  <Link href="/register" variant="body2">
                    Need an account?
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </div>
  );
};

export default Login;
