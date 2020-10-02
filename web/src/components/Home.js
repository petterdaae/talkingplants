import React from "react";
import RoundedImage from "./RoundedImage";
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
                to={{ pathname: "/plant/11" }}
            >
                <PlantMenuEntry id={11}></PlantMenuEntry>
            </StyledLink>
        </MenuWrapper>
    </div >;
}

export default Home;