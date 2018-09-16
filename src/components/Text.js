import React from 'react';
import '../css/Text.css';
const Text = ({text=''}) => {
    return (
        <div id= "text"> 
            {text}
        </div>
    )
};


export default Text;