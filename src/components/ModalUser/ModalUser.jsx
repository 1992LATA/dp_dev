
import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import FormUser from '../FormUser/FormUser';

class ModalUser extends Component {
  render() {
    return (
      <Modal
        dimmer="inverted"
        size="tiny"
        closeIcon
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <Modal.Header>{this.props.headerTitle}</Modal.Header>
        <Modal.Content>
          <FormUser
            buttonSubmitTitle={this.props.buttonSubmitTitle}
            buttonColor={this.props.buttonColor}
            userID={this.props.userID}
            userData={this.props.userData}
            onUserUpdated={this.props.onUserUpdated}
            onClose={this.props.onClose}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalUser;
