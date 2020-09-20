import React from "react";
import Home from './components/Home';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import styled from "@emotion/styled";
import Plant from "./components/Plant";

const NotFound = styled.div`
  text-align: center;
  padding: 200px;
`;

const Center = styled.div`
  text-align: center;
`;

function App() {
  return (<Router>
    <Switch>
      <Route exact path="/">
        <Home></Home>
      </Route>
      <Route exact path="/plant">
        <Center>
          <Plant id={10}></Plant>
        </Center>
      </Route>
      <Route path="/">
        <NotFound>Not found</NotFound>
      </Route>
    </Switch>
  </Router>);
}

export default App;
