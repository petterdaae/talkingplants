import React from "react";
import styled from '@emotion/styled'
import { Link } from "react-router-dom";
import PlantMenuEntry from "./PlantMenuEntry";

const MenuWrapper = styled.div`
    text-align: center;
`;

const StyledLink = styled(Link)`
    display: block;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
`;

function Home({ plants }) {
    return <div>
        <MenuWrapper>
            {plants.map(plant => (
                <StyledLink
                    to={{ pathname: `/plant/${plant.id}` }}
                    key={plant.id}
                >
                    <PlantMenuEntry plant={plant}></PlantMenuEntry>
                </StyledLink>
            ))}
        </MenuWrapper>
    </div >;
}

export default Home;