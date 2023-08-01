import React, { useContext, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import styles from "./PageTemplate.module.css";
import clsx from "clsx";
import {
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Navbar from "./Navbar";
import SecondNavbar from "./SecondNavbar";
import Dashboard from "../Dashboard/Dashboard";
import News from "../News/News";
import Search from "../Search/Search";
import SettingsModal from "./SettingsModal";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {}),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    background: "#222831 !important",
    color: "white !important",
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: "#222831 !important",
    color: "white !important",
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  divider: {
    background: "white",
  },
}));

const PageTemplate = () => {
  const history = useHistory();
  const classes = useStyles();
  const { userData, setUserData } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [purchasedStocks, setPurchasedStocks] = useState([]);
  const [loading, setLoading] = useState(false)

  if (!userData.user) {
    history.push("/login");
  }

  useEffect(() => {
    const getPurchasedStocks = async () => {
      setLoading(true);
      const url = `https://stockker-app.herokuapp.com/api/stock/${userData.user.id}`;
      const headers = {
        "x-auth-token": userData.token,
      };

      const response = await Axios.get(url, {
        headers,
      });
      if (response.data.status === "success") {
        setPurchasedStocks(response.data.stocks);
        setLoading(false);
      }
    };
    getPurchasedStocks();
  }, []);

  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
    history.push("/");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const openSettings = () => {
    setSettingsOpen(true);
  };

  return (
    <div className={styles.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        style={{ background: "#222831" }}
        className={clsx(
          styles.appBarBackground,
          classes.appBar,
          open && classes.appBarShift
        )}
      >
        <Toolbar className={styles.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(styles.menuButton, open && styles.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={styles.title}
          >
            {currentPage === "dashboard" && "Dashboard"}
            {currentPage === "news" && "Market News"}
            {currentPage === "search" && "Search"}
          </Typography>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={styles.title}
          >
            <Link
              to="/dashboard"
              style={{
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "25px",
                color: "white",
              }}
            >
              Stocker
            </Link>
          </Typography>
          <Typography color="inherit">
            Hello {" "}
            {userData.user.username
              ? userData.user.username.charAt(0).toUpperCase() +
                userData.user.username.slice(1)
              : ""}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={styles.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon style={{ color: "white" }} />
          </IconButton>
        </div>
        <Divider />
        <List>
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </List>
        <Divider classes={{ root: classes.divider }} />
        <List>
          <SecondNavbar logout={logout} openSettings={openSettings} />
        </List>
      </Drawer>
      <main className={styles.content}>
        <div className={classes.appBarSpacer} />
        {currentPage === "dashboard" && (
          <Dashboard purchasedStocks={purchasedStocks} loading={loading}/>
        )}
        {currentPage === "news" && <News/>}
        {currentPage === "search" && (
          <Search
            setPurchasedStocks={setPurchasedStocks}
            purchasedStocks={purchasedStocks}
            loading={loading}
          />
        )}
        {settingsOpen && <SettingsModal setSettingsOpen={setSettingsOpen} />}
      </main>
    </div>
  );
};

export default PageTemplate;
