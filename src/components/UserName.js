import React from 'react';
import '../css/Hidden.css';

const UserName = ({user = '', hidden=''}) => {
    return (
        <div className={hidden}
            style={{display: 'flex', justifyContent: 'space-between'}}>

            <button class='ui circular icon button' role='button' >
                <i aria-hidden='true' class='sign-out large icon' />
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