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

function Home() {
    return <div>
        <MenuWrapper>
            <StyledLink
                to={{ pathname: "/plant/10" }}
            >
                <PlantMenuEntry id={10}></PlantMenuEntry>
            </StyledLink>
            <StyledLink
                to={{ pathname: "/plant/13" }}
            >
                <PlantMenuEntry id={13}></PlantMenuEntry>
            </StyledLink>
        </MenuWrapper>
    </div >;
}

export default Home;