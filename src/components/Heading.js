import React from 'react';
import './Heading.css';

const Heading = ({heading}) => {
    return (
        <h3 style={{position: 'reletive',}}> 
            {heading}
        </h3>
    )
}

export default Heading;