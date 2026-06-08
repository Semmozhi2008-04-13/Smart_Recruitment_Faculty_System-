import React, { useState } from 'react';
import Espresso from '../assets/cafeespresso.png';
import './Card.css';


function Card() {
    return (
        <>
            <div className='card'>
                <img src={Espresso} alt="espresso" className='card=img' />
                <h2 className='card-title'>Welcome to Cafe Espresso!</h2>
                <p className='card-desc'>Taste a variety of delicious coffee and other sweet treats!</p>
                <button id="mybutton">Learn More</button>
            </div>
        </>
    );
}

export default Card;