import React, { useEffect, useState } from "react";
import RoundedImage from "../RoundedImage";
import Data from "./Data";
import styled from "@emotion/styled";
import LineChart from "../LineChart";
import BrushChart from "../BrushChart";

const Wrapper = styled.div`
    display: inline-block;
`;

const StyledHeader = styled.h2`
`;

function Plant({ id }) {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/data?plant=${id}`).then(data => data.json()).then(json => setData(json));
    }, [id]);
    const lineChartData = [{ id: 'moisture', data: data.map((entry => ({ x: entry.timestamp.substring(0, 10), y: entry.data }))) }];
    return (
        <Wrapper>
            <RoundedImage name="begonia.jpg" size="250px"></RoundedImage>
            <StyledHeader>Begonia Maculata</StyledHeader>
            <BrushChart width={500} height={500}></BrushChart>
            <Data data={data}></Data>
        </Wrapper>
    );
}

export default Plant;