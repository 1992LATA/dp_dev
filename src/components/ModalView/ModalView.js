import React, { Component } from 'react';
import { Modal, Table, Loader } from 'semantic-ui-react';
import axios from 'axios';

class ModalView extends Component {
  state = {
    documents: [],
    loading: false,
  };

  componentDidMount() {
    if (this.props.open && this.props.userData?.collectionName) {
      this.fetchDocuments();
    }
  }

  componentDidUpdate(prevProps) {
    const currentName = this.props.userData?.collectionName;
    const prevName = prevProps.userData?.collectionName;

    if (
      (this.props.open && !prevProps.open && currentName) ||
      (this.props.open && currentName && currentName !== prevName)
    ) {
      this.fetchDocuments();
    }
  }

  fetchDocuments = async () => {
    const collectionName = this.props.userData?.collectionName;
    console.log("userData passed to ModalView:", this.props.userData);
    console.log("Resolved collectionName:", collectionName);

    if (!collectionName) {
      console.warn("No collectionName found in userData.");
      return;
    }

    this.setState({ loading: true });
    try {
      const response = await axios.get(
        `http://nhtridevsrv.nht.gov.jm:8777/api/v1/GetDocumentsByCollectionName?collectionName=${encodeURIComponent(collectionName)}`
      );
      console.log("API raw response:", response.data);
      const documents = response.data?.data?.documentsRequired || [];
      console.log("Parsed documents:", documents);
      this.setState({ documents, loading: false });
    } catch (error) {
      console.error('Error fetching document data:', error.message);
      this.setState({ documents: [], loading: false });
    }
  };

  render() {
    const { open, onClose } = this.props;
    const { documents, loading } = this.state;

    return (
      <Modal dimmer="inverted" size="tiny" closeIcon open={open} onClose={onClose}>
        <Modal.Header>Required Documents</Modal.Header>
        <Modal.Content>
          {loading ? (
            <Loader active inline="centered" />
          ) : (
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Document Name</Table.HeaderCell>
                  <Table.HeaderCell>Quantity Required</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{doc.documentName}</Table.Cell>
                      <Table.Cell>{doc.quantityRequired}</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan="2" textAlign="center" style={{ color: 'red' }}>
                      No required documents found.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          )}
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalView;
