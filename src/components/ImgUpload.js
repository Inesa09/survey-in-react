import React from 'react';

import '../css/Hidden.css';

const ImgUpload = ({tooltip, uploadImg}) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            margin: '30px',
        }}>
            <div className="ui icon header">
                <i className="file image outline icon"></i>
                {tooltip}
            </div>
            <label style={{display:'flex', justifyContent: 'center'}}>
                <div className="ui left labeled icon violet button">
                    <i className="upload icon"></i>
                    <input className='hidden' type='file' accept="image/*"
                    onChange={uploadImg} id='imgInput'/> 
                    Upload
                </div>
            </label>
            
        </div>
    )
}

export default ImgUpload;