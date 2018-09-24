import React from 'react';
import '../css/Hidden.css';

const UserName = ({user = '', hidden='', signOut}) => {
    return (
        <div className={hidden}
            style={{display: 'flex', justifyContent: 'space-between', marginRight: '-10px'}}>

            <button className='ui circular icon button' onClick={signOut} >
                <i aria-hidden='true' className='sign-out large icon' />
                <div className='content'> Sign Out </div>
            </button>
            <h2 className='ui header' style={{display: 'flex'}}>
                <div className='content' style={{ color: 'white', marginRight: '10px'}}> { user } </div>
                <i aria-hidden='true' className='user circle inverted icon' />
            </h2>
        </div>
    )
}

export default UserName;