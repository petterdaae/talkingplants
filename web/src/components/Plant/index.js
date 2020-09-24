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
        fetch(`${process.env.REACT_APP_API_URL}/data?plant=${id}`).then(data => data.json()).then(json => {
            console.log(json);
            setData(json)
        });
    }, [id]);
    return (
        <Wrapper>
            <RoundedImage name="begonia.jpg" size="250px"></RoundedImage>
            <StyledHeader>Begonia Maculata</StyledHeader>
            {data.length > 0 ? <BrushChart width={1300} height={600} data={data}></BrushChart> : null}
            {/*<Data data={data}></Data>*/}
        </Wrapper>
    );
}

export default Plant;