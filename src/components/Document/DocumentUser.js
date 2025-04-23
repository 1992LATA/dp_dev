import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

import DocumentForm from '../Document/DocumentForm';

class DocumentUser extends Component {

  render() {
    return (
      <Modal
        trigger={<Button color={this.props.buttonColor}>{this.props.buttonTriggerTitle}</Button>}
        dimmer='inverted'
        size='tiny'
        closeIcon='close'
      >
        <Modal.Header>{this.props.headerTitle}</Modal.Header>
        <Modal.Content>
          <DocumentForm
            buttonSubmitTitle={this.props.buttonSubmitTitle}
            buttonColor={this.props.buttonColor}
            userID={this.props.userID}
            onUserAdded={this.props.onUserAdded}
            onUserUpdated={this.props.onUserUpdated}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default DocumentUser;