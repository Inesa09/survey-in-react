import React from 'react';

const SmallMessage = ({name, id=name, text1, text2}) => {
    return (
        <div className={`ui ${name} message`} id={id}
        style={{
            margin: '40px',
            marginTop: '0',
            display: 'none',
        }}>
        <div className='content'>
            <div className='header'>{text1}</div>
            <p>{text2}</p>
        </div>
    </div>
    )
}

export default SmallMessage;