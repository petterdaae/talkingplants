import React from "react";
import "./Home.css";
import RoundedImage from "./RoundedImage";

function Home() {
    return <div>
        <h1 className="header"><span role="img" aria-label="plant emoji">🌱</span> Talking Plants</h1>
        <div className="menu-wrapper">
            <RoundedImage name="begonia.jpg" size="250px"></RoundedImage>
            <RoundedImage name="paraply.jpg" size="250px"></RoundedImage>
        </div>
    </div>;
}

export default Home;