import React, { useEffect, useState } from "react";
import RoundedImage from "../RoundedImage";
import Data from "./Data";
import styled from "@emotion/styled";
import BrushChart from "../BrushChart";
import { css } from '@emotion/core';

const Wrapper = styled.div`
    display: inline-block;
`;

const BrushWrapper = styled.div`
    user-select: none;
`;

function Plant({ id }) {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/data?plant=${id}`).then(data => data.json()).then(json => {
            setData(json)
        });
    }, [id]);
    return (
        <Wrapper>
            <RoundedImage name="begonia.jpg" size="250px"></RoundedImage>
            <h2>Begonia Maculata</h2>
            {data.length > 0 ? (
                <>
                    { document.body.clientWidth > 1600
                        ? (<BrushWrapper>
                            <BrushChart className={css`user-select: none;`} width={1600} height={600} data={data} minPadding={100} />
                        </BrushWrapper>)
                        : null
                    }
                    <Data data={data}></Data>
                </>
            ) : null}
        </Wrapper>
    );
}

export default Plant;