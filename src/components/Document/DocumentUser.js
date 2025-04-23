
<<<<<<<< HEAD:src/components/Document/DocumentUser.js
import DocumentForm from '../Document/DocumentForm';

class DocumentUser extends Component {

========
import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import FormUser from '../FormUser/FormUser';

class ModalUser extends Component {
>>>>>>>> 5edb5f25083b865db6679e9b1ae3dd3c7b44c177:src/components/ModalUser/ModalUser.js
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
          <DocumentForm
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

export default DocumentUser;