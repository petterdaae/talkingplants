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

function Plant({ id, image, name }) {
    const [data, setData] = useState([]);
    const [firstFetchFinished, setFirstFetchFinished] = useState(false);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/data?plant=${id}`).then(data => data.json()).then(json => {
            setData(json)
            setFirstFetchFinished(true);
        });
    }, [id]);
    return (
        <Wrapper>
            <RoundedImage name={image} size="250px"></RoundedImage>
            <h2>{name}</h2>
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
            ) : firstFetchFinished ? <p>This plant has not told me anything yet <span role="img" aria-label="sad face">😔</span></p> : null}
        </Wrapper>
    );
}

export default Plant;