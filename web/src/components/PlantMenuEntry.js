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

function PlantMenuEntry({ plant }) {
    return (
        <Wrapper>
            {plant.id % 2 === 0 ? <Info plant={plant}></Info> : null}
            <StyledRoundedImage name={`/${plant.id}.jpg`} size="200px"></StyledRoundedImage>
            {plant.id % 2 === 1 ? <Info plant={plant}></Info> : null}
        </Wrapper>
    );
}

const TdVal = styled.td`
    text-align: right;
    font-style: italic;
`;

function Info({ plant }) {
    return <InfoWrapper>
        <h3>{plant.name}</h3>
        <table>
            <tbody>
                <tr>
                    <td><span role="img" aria-label="drop-emoji">💧</span> Moisture:</td>
                    <TdVal>{plant.moisture}</TdVal>
                </tr>
                <tr>
                    <td><span role="img" aria-label="clock-emoji">⏰</span> Last meassure:</td>
                    <TdVal>{plant.last_meassure}</TdVal>
                </tr>
            </tbody>
        </table>
    </InfoWrapper>;
}

export default PlantMenuEntry;