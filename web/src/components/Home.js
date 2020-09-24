import React from "react";
import RoundedImage from "./RoundedImage";
import styled from '@emotion/styled'
import { Link } from "react-router-dom";

const MenuWrapper = styled.div`
    padding-top: 100px;
    text-align: center;
    margin-left: 500px;
    margin-right: 500px;
    @media (max-width: 900px) {
        margin-left: 20px;
        margin-right: 20px;
    }
`;

const StyledLink = styled(Link)`
    cursor: pointer;
`;

function Home() {
    return <div>
        <MenuWrapper>
            <StyledLink
                to={{ pathname: "/plant/10" }}
            >
                <RoundedImage name="begonia.jpg" size="250px"></RoundedImage>
            </StyledLink>
            <StyledLink
                to={{ pathname: "/plant/11" }}
            >
                <RoundedImage name="paraply.jpg" size="250px"></RoundedImage>
            </StyledLink>
        </MenuWrapper>
    </div >;
}

export default Home;