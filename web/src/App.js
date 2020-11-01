import React, { useEffect, useState } from "react";
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
  let [plants, setPlants] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/plants`).then(data => data.json()).then(json => {
      setPlants(json);
    });
  }, []);
  return (<Router>
    <Center>
      <StyledLink
        to={{ pathname: "/" }}
      >
        <Header><span role="img" aria-label="plant emoji">🌱</span> Talking Plants</Header>
      </StyledLink>
    </Center>
    <Switch>
      {plants.map(plant => (
        <Route exact path={`/plant/${plant.id}`} key={plant.id}>
          <Center>
            <Plant plant={plant}></Plant>
          </Center>
        </Route>
      ))}
      <Route exact path="/">
        <Home plants={plants}></Home>
      </Route>
      <Route path="/">
        <NotFound>Not found</NotFound>
      </Route>
    </Switch>
  </Router>);
}

export default App;
