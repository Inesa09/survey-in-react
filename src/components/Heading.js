import React from 'react'

const Heading = (heading) => {
    return (
        <div style={{position: 'fixed', top: '0', borderBottom: '1px solid black', height: 'fitcontent', 
                    width: '100%', background: 'linear-gradient(to right, lightcyan, darkgray)'}}> 
            {heading}
        </div>
    )
}

export default Heading;