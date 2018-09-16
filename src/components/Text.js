import React from 'react';
import './Text.css';
import LightText from './LightText';

const Text = ({text,heading}) => {
    return (
        <div id= "text"> 
            <LightText text={text} heading={heading}/>
        </div>
    )
};


export default Text;