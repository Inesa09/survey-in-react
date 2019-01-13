import React from 'react';

import '../css/Input.css';
import '../css/Hidden.css';

const ImgSetter = ({ tooltip, uploadImg, handleImgLoad, image }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            margin: '15px',
        }}>
            <div className="ui icon header">
                <i className="file image outline icon"></i>
                {tooltip}
            </div>
            <div className="ui buttons" style={{display:'flex', marginTop: '5px'}}>
                <label style={{display:'flex', justifyContent: 'center', }}>
                    <div className="ui left labeled icon violet button">
                        <i className="upload icon"></i>
                        <input className='hidden' type='file' accept="image/*"
                        onChange={uploadImg} id='imgInput'/> 
                        Upload
                    </div>
                </label>
                <div className="or"></div>
                {/* <div className="ui right labeled icon violet button">
                    <i className="globe icon"></i>
                    <input className='hidden' type='file' accept="image/*"
                    onChange={uploadImg} id='imgInput'/> 
                    Input URL
                </div> */}

                <div className='ui small input' style={{display: 'flex', width:'95%'}}>
                    <input id='inputImgUrl' type="text" value={image}
                    onChange={() => { handleImgLoad(image) }}
                    placeholder='Input image URL' />   
                </div>
            </div>            
        </div>
    )
}

export default ImgSetter;