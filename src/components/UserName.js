import React from 'react';
import '../css/Hidden.css';

const UserName = ({user = '', hidden='', signOut}) => {
    return (
        <div className={hidden}
            style={{display: 'flex', justifyContent: 'space-between'}}>

            <button className='ui circular icon button' onClick={signOut} >
                <i aria-hidden='true' className='sign-out large icon' />
                <div className='content'> Sign Out </div>
            </button>
            <h2 className='ui header'>
                <i aria-hidden='true' className='user circle inverted icon' />
                <div className='content' style={{ color: 'white'}}> { user } </div>
            </h2>
        </div>
    )
}

export default UserName;