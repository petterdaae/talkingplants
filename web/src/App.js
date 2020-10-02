import React from "react";
import Home from './components/Home';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import styled from "@emotion/styled";
import Plant from "./components/Plant";
import { Link } from "react-router-dom";

const NotFound = styled.div`
  text-align: center;
  padding: 200px;
`;

const Center = styled.div`
  text-align: center;
`;

const Header = styled.h1`
    text-align: center;
`;

const StyledLink = styled(Link)`
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    text-decoration: none;
`;

function App() {
  return (<Router>
    <Center>
      <StyledLink
        to={{ pathname: "/" }}
      >
        <Header><span role="img" aria-label="plant emoji">🌱</span> Talking Plants</Header>
      </StyledLink>
    </Center>
    <Switch>
      <Route exact path="/">
        <Home></Home>
      </Route>
      <Route exact path="/plant/10">
        <Center>
          <Plant id={10} name="Begonia Maculata" image="/begonia.jpg"></Plant>
        </Center>
      </Route>
      <Route exact path="/plant/11">
        <Center>
          <Plant id={11} name="Schefflera" image="/paraply.jpg"></Plant>
        </Center>
      </Route>
      <Route path="/">
        <NotFound>Not found</NotFound>
      </Route>
    </Switch>
  </Router>);
}

export default App;
