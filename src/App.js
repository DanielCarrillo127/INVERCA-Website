import React from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import RegistroPage from "./components/RegistroPage";
import GestorPage from "./components/GestorPage";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/registro" component={RegistroPage} />
      <Route path="/gestor" component={GestorPage} />
    </Switch>
  );
}

export default App;
