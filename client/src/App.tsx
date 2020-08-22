import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import RaffleDrawer from "./pages/raffle-drawer/RaffleDrawer";
import NavBar from "./pages/NavBar/NavBar";
import Entries from "./pages/Entries/Entries";
import Winners from "./pages/Winners/Winners";
import Prizes from "./pages/Prizes/Prizes";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path={"/login"} component={Login} />

          <NavBar>
            <Route exact path={"/"} component={Winners} />
            <ProtectedRoute path={"/home"} component={RaffleDrawer} />
            <ProtectedRoute path={"/entries"} component={Entries} />
            <ProtectedRoute path={"/winners"} component={Winners} />
            <ProtectedRoute path={"/prizes"} component={Prizes} />
          </NavBar>
        </Switch>
      </Router>
    </>
  );
}

export default App;
