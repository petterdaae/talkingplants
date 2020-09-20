import React from "react";
import RoundedImage from "./RoundedImage";
import styled from '@emotion/styled'

const Header = styled.h1`
    text-align: center;
`;

const MenuWrapper = styled.div`
    padding-top: 100px;
    text-align: center;
    margin-left: 500px;
    margin-right: 500px;
`;

function Home() {
    return <div>
        <Header><span role="img" aria-label="plant emoji">🌱</span> Talking Plants</Header>
        <MenuWrapper>
            <RoundedImage name="begonia.jpg" size="250px"></RoundedImage>
            <div></div>
            <RoundedImage name="paraply.jpg" size="250px"></RoundedImage>
        </MenuWrapper>
    </div >;
}

export default Home;