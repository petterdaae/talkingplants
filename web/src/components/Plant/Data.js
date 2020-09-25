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

const Wrapper = styled.div`
    display: inline-block;
`;

function formatTimestamp(timestamp) {
    let date = new Date(timestamp + " UTC");
    let day = pad(date.getDate(), 2);
    let month = pad(date.getMonth(), 2);
    let hour = pad(date.getHours(), 2);
    let seconds = pad(date.getSeconds(), 2);
    return `${day}/${month} ${hour}:${seconds}`;
}

function pad(str, length) {
    let result = "" + str;
    while (result.length < length) {
        result = "0" + result;
    }
    return result;
}

function Data({ data }) {
    return (
        <Wrapper>
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
                            <StyledTd>{formatTimestamp(entry.timestamp)}</StyledTd>
                            <StyledTd>{entry.data}</StyledTd>
                        </tr>)
                    }
                </tbody>
            </StyledTable>
        </Wrapper>
    );
}

export default Data;