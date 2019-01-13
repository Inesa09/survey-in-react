import React, { Component } from 'react';

import Image from '../components/Image';
import ImgSetter from '../components/ImgSetter';

class ImgUploader extends Component {

  constructor(props) {
    super(props);
    this.state = {
        uploading: false,
        notImg: false,
        image: this.props.answer,
    }; // <- set up react state
  }

  uploadImg = e => {
    this.setState({ uploading: true });

    const img = e.target.files[0];
    const newImg = URL.createObjectURL(img);
    const type = img.type;

    if (!type.includes("image"))
      this.setState({ uploading: false, notImg: true });
    else {
      this.setState({ uploading: false, notImg: false, image: newImg });
      this.props.handleImgLoad(newImg);

      console.log(img);
    }
  }

  removeImg = () => {
    this.setState({ image: '' });
    this.props.handleImgLoad('');
  }

  static getDerivedStateFromProps(props, state) {
    return { image: props.answer }
  }

  render() {
    const { uploading, notImg, image } = this.state
    const { tooltip } = this.props

    const content = () => {
      switch(true) {
        case uploading:
          return <div class="ui active inverted dimmer">
            <div class="ui indeterminate text loader">Preparing Image</div>
          </div>
        case notImg:
          return <div>
            <ImgSetter tooltip={tooltip} uploadImg={this.uploadImg} 
              handleImgLoad={(img) => this.props.handleImgLoad(img)} value={image} />
            <div className={`ui negative message`}>
              <div className='content'>
                <div className='header'>Wrong Format</div>
                <p>Upload an image please!</p>
              </div>
            </div>
          </div>
        case image !== undefined && image !== '':
          return <Image img={image} removeImg={this.removeImg} />
        default:
          return <ImgSetter tooltip={tooltip} uploadImg={this.uploadImg}
            handleImgLoad={(img) => this.props.handleImgLoad(img)} value={image}/>
      }
    }

    return (
      <div className="ui placeholder segment" style={{ margin:"30px", minHeight:'100px' }}> 
        {content()} 
      </div>
    )
  }
}

export default ImgUploader;
