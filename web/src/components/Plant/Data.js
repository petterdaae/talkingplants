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
            <thead>
                <tr>
                    <StyledTh>Timestamp</StyledTh>
                    <StyledTh>Data</StyledTh>
                </tr>
            </thead>
            <tbody>
                {data.map(entry =>
                    <tr key={entry.timestamp}>
                        <StyledTd>{entry.timestamp}</StyledTd>
                        <StyledTd>{entry.data}</StyledTd>
                    </tr>)
                }
            </tbody>
        </StyledTable>
    );
}

export default Data;