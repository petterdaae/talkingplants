import React from "react";
import styled from '@emotion/styled'
import RoundedImage from "./RoundedImage";

const StyledRoundedImage = styled(RoundedImage)`
    display: inline-block;
`;

const InfoWrapper = styled.div`
    display: inline-block;
    text-align: left;
    padding: 32px;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

function PlantMenuEntry({ id }) {
    let src = id === 10 ? "begonia.jpg" : "paraply.jpg";
    return (
        <Wrapper>
            {id === 11 ? <Info></Info> : null}
            <StyledRoundedImage name={src} size="200px"></StyledRoundedImage>
            {id === 10 ? <Info></Info> : null}
        </Wrapper>
    );
}

const TdKey = styled.td`
`;

const TdVal = styled.td`
    text-align: right;
    font-style: italic;
`;

function Info() {
    return <InfoWrapper>
        <h3>Begonia Maculata</h3>
        <table>
            <tbody>
                <tr>
                    <TdKey><span role="img" aria-label="drop-emoji">💧</span> Moisture:</TdKey>
                    <TdVal>TBA</TdVal>
                </tr>
                <tr>
                    <TdKey><span role="img" aria-label="clock-emoji">⏰</span> Last meassure:</TdKey>
                    <TdVal>TBA</TdVal>
                </tr>
            </tbody>
        </table>
    </InfoWrapper>;
}

export default PlantMenuEntry;