import React, { useEffect, useState } from "react";
import RoundedImage from "../RoundedImage";
import Data from "./Data";
import styled from "@emotion/styled";

const Wrapper = styled.div`
    display: inline-block;
`;

const StyledHeader = styled.h2`
`;

function Plant({ id }) {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:8080/data?plant=${id}`).then(data => data.json()).then(json => setData(json));
    }, [id]);
    return (
        <Wrapper>
            <RoundedImage name="begonia.jpg" size="250px"></RoundedImage>
            <StyledHeader>Begonia Maculata</StyledHeader>
            <Data data={data}></Data>
        </Wrapper>
    );
}

export default Plant;