import React from "react";
import styled from '@emotion/styled'

const StyledImage = styled.img`
    display: inline-block;
    border-radius: 50%;
    padding: 8px;
    cursor: pointer;
`;

function RoundedImage({ size, name }) {
    return <StyledImage src={name} alt="plant" height={size} width={size}></StyledImage>
}

export default RoundedImage;