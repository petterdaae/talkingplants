import styled from "@emotion/styled";
import React from "react";

const StyledTable = styled.table`
    border-collapse: collapse;
    table-layout: fixed;
    width: 600px;
    @media (max-width: 900px) {
        width: calc(100vw - 16px);
    }
`;

const StyledTd = styled.td`
    border: 1px solid #a1a1a1;
`;

function Data({ data }) {
    return (
        <StyledTable>
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Data</th>
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