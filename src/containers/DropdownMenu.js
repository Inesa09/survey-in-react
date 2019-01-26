import React, { Component } from 'react';
import { Dropdown, Icon } from 'semantic-ui-react'
import fireDB from '../fireDB';
import gcp_config from '../GCP_configs';


class DropdownMenu extends Component {

  // ---> FIREBASE DB <---
  signOut = () => {
    fireDB.auth().signOut();
  }

  delete = (itemId) => {

    if (window.confirm("Are you sure?")) {
      let headers = new Headers();
      headers.set('Authorization', 'Basic ' + btoa(gcp_config.username + ":" + gcp_config.password));
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');

      fetch('https://roadio-master.appspot.com/v1/delete_item', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ datastore_id: itemId })
      }).then(res => console.log('Status: ', res.status))
        .catch(error => console.error('Error: ', error));

      window.location.reload();
    }
  }


  render() {

    const getDelete = (itemId) => {
      if (!itemId) {
        return null;
      } else {
        return (
          <Dropdown.Item onClick={() => this.delete(this.props.itemId)}>
            <Icon name='trash alternate' />
            <span className='text'>Delete this item</span>
          </Dropdown.Item>
        )
      }
    }

    return (
      <Dropdown text='Settings' floating labeled button className='icon' icon='cogs'
        style={{ height: '35px', alignSelf: 'flex-end' }}>
        <Dropdown.Menu className='left'>

          <Dropdown.Item onClick={this.props.setNew} >
            <Icon name='edit' />
            <span className='text'>Add new item</span>
          </Dropdown.Item>

          {getDelete(this.props.itemId)}

          <Dropdown.Item onClick={this.signOut}>
            <Icon name='sign-out' />
            <span className='text'>Sign out</span>
          </Dropdown.Item>

        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

export default DropdownMenu;