import React, { useEffect, useState } from "react";
import Data from "./Data";

function Plant({ id }) {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:8080/data?plant=${id}`).then(data => data.json()).then(json => setData(json));
    }, [id]);
    return (
        <div>
            <Data data={data}></Data>
        </div>
    );
}

export default Plant;