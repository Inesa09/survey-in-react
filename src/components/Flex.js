import React from 'react'

const Flex = (props) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
        }}>
            {props.children}
        </div>
    )
}

export default Flex;