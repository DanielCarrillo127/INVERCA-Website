import React from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import RegistroPage from "./components/RegistroPage";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/registro" component={RegistroPage} />
    </Switch>
  );
}

export default App;
