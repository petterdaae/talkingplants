import React from "react";
import styled from '@emotion/styled'

const StyledImage = styled.img`
    border-radius: 50%;
    padding: 8px;
`;

function RoundedImage({ size, name }) {
    return <StyledImage src={name} alt="plant" height={size} width={size}></StyledImage>
}

export default RoundedImage;