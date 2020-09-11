import React from "react";
import "./index.css"

function RoundedImage({ size, name }) {
    return <img src={name} alt="plant" className="image" height={size} width={size}></img>
}

export default RoundedImage;