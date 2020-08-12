import React from "react";
import "./App.css";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import RaffleDrawer from "./pages/raffle-drawer/RaffleDrawer";
import NavBar from "./pages/NavBar/NavBar";
import Entries from "./pages/Entries/Entries";
import Winners from "./pages/Winners/Winners";
import Prizes from "./pages/Prizes/Prizes";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <NavBar>
            <Route exact path={"/"} component={RaffleDrawer} />
            <Route exact path={"/entries"} component={Entries} />
            <Route exact path={"/winners"} component={Winners} />
            <Route exact path={"/prizes"} component={Prizes} />
          </NavBar>
        </Switch>
      </Router>
    </>
  );
}

export default App;
