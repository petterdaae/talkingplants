import styled from "@emotion/styled";
import React from "react";

const StyledTable = styled.table`
    border-collapse: collapse;
`;

const StyledTd = styled.td`
    border: 1px solid #a1a1a1;
    padding: 0.5rem;
`;

const StyledTh = styled.th`
    text-align: left;
    padding: 0.5rem;
`;

function Data({ data }) {
    return (
        <StyledTable>
            <tr>
                <StyledTh>Timestamp</StyledTh>
                <StyledTh>Data</StyledTh>
            </tr>
            {data.map(entry =>
                <tr>
                    <StyledTd>2020-08-12 12:34:45</StyledTd>
                    <StyledTd>932</StyledTd>
                </tr>)
            }
        </StyledTable>
    );
}

export default Data;