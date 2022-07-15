import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login, Register, NotFound, PageTemplate } from "./components";
import UserContext from "./context/UserContext";
import axios from "axios";
import LandingPage from "./components/Landing/LandingPage";
import './App.module.css'
function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token == null) {
        localStorage.setItem("auth-token", "");
        token = "";
        setUserData({ token: undefined, user: undefined });
        return;
      }

      const headers = {
        "x-auth-token": token,
      };

      const tokenIsValid = await axios.post(
        "https://stockker-app.herokuapp.com/api/auth/validate",
        null,
        {
          headers,
        }
      );

      if (tokenIsValid.data) {
        const userRes = await axios.get("https://stockker-app.herokuapp.com/api/auth/user", {
          headers,
        });
        setUserData({
          token,
          user: userRes.data,
        });
      } else {
        setUserData({ token: undefined, user: undefined });
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <Router>
      <UserContext.Provider value={{ userData, setUserData }}>
        <div>
          <Switch>
            <Route path="/" exact component={LandingPage} />
            {userData.user ? (
              <Route path="/dashboard" exact component={PageTemplate} />
            ) : (
              <Route path="/" exact component={LandingPage} />
            )}
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
