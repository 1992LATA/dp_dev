

import React, { Component } from 'react';
import { Message, Button, Form, Dropdown, Container, Modal } from 'semantic-ui-react';
import axios from 'axios';

const formOptions = [
  { key: 'document', text: 'Add Document', value: 'document' },
  //{ key: 'documentType', text: 'Add Document Type', value: 'documentType' },
  //{ key: 'documentReference', text: 'Add Document Reference', value: 'documentReference' }
];

class DocumentForm extends Component {
  state = {
    selectedForm: '',
    documentTypeOptions: [],
    documentTypeID: null,
    documentReferenceID: '',
    documentID: '',
    name: '',
    description: '',
    documentCategory: '',
    isActive: true,
    dateCreated: new Date().toISOString(),
    formSuccessMessage: '',
    formErrorMessage: '',
    showModal: false,
  };

  componentDidMount() {
    this.fetchDocumentTypes();
  }

  fetchDocumentTypes = async () => {
    try {
      const response = await axios.get('http://nhtridevsrv.nht.gov.jm:8777/api/v1/GetAllDocumentTypes');
      const documentTypes = response.data?.data || [];

      const options = documentTypes.map((docType, index) => ({
        key: index + 1,
        text: docType,
        value: docType
      }));

      this.setState({
        documentTypeOptions: options,
        documentTypeID: options[0]?.value || null
      });
    } catch {
      this.setState({ formErrorMessage: 'Failed to load document types.' });
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleDropdownChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleFormSelection = (e, { value }) => {
    this.setState({
      selectedForm: value,
      formSuccessMessage: '',
      formErrorMessage: '',
      name: '',
      description: '',
      documentCategory: '',
      documentID: '',
      documentReferenceID: '',
      documentTypeID: this.state.documentTypeOptions[0]?.value || null
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ showModal: true });
  };

  confirmSubmit = async () => {
    this.setState({ showModal: false });

    const {
      selectedForm, name, description, documentTypeID,
      documentCategory, documentID, documentReferenceID,
      isActive, dateCreated
    } = this.state;

    let payload = {};
    let apiUrl = '';

    // Validation & Payload Prep
    if (selectedForm === 'document') {
      if (!name.trim() || !description.trim()) {
        this.setState({ formErrorMessage: 'Document Name and Description are required.' });
        return;
      }
      payload = {
        documentID: parseInt(documentID, 10) || 0,
        name: name.trim(),
        description: description.trim(),
        documentTypeID,
        dateCreated,
        isActive
      };
      apiUrl = 'http://nhtridevsrv.nht.gov.jm:8777/api/v1/AddDocument';
    } else if (selectedForm === 'documentType') {
      if (!name.trim() || !documentCategory.trim()) {
        this.setState({ formErrorMessage: 'Type Name and Category are required.' });
        return;
      }
      payload = {
        documentTypeID: 0,
        name: name.trim(),
        description: description.trim(),
        documentCategory: documentCategory.trim(),
        isActive,
        dateCreated
      };
      apiUrl = 'http://nhtridevsrv.nht.gov.jm:8777/api/v1/AddDocumentType';
    } else if (selectedForm === 'documentReference') {
      payload = {
        documentReferenceID: parseInt(documentReferenceID, 10) || 0,
        documentID: parseInt(documentID, 10) || 0,
        documentTypeID
      };
      apiUrl = 'http://nhtridevsrv.nht.gov.jm:8777/api/v1/AddDocumentTypeReference';
    }

    try {
      const response = await axios.post(apiUrl, payload);
      this.setState({
        formSuccessMessage: response.data?.responseMessage || 'Successfully submitted!',
        formErrorMessage: ''
      });

      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (err) {
      this.setState({
        formErrorMessage: err.response?.data?.message || 'Submission failed. Please try again.'
      });
    }
  };

  render() {
    const {
      selectedForm, documentTypeOptions, documentTypeID, showModal,
      formSuccessMessage, formErrorMessage
    } = this.state;

    return (
      <Container textAlign="center">
        <Form onSubmit={this.handleSubmit}>
          <Form.Field
            control={Dropdown}
            label="Select Form Type"
            options={formOptions}
            placeholder="Choose a form"
            selection
            required
            value={selectedForm}
            onChange={this.handleFormSelection}
          />

          {selectedForm === 'document' && (
            <>
              <Form.Input label="Document Name" name="name" required onChange={this.handleInputChange} />
              <Form.TextArea label="Description" name="description" required onChange={this.handleInputChange} />
              <Form.Field
                control={Dropdown}
                label="Document Type"
                name="documentTypeID"
                placeholder="Select Document Type"
                selection
                options={documentTypeOptions}
                value={documentTypeID || ''}
                onChange={this.handleDropdownChange}
              />
            </>
          )}

          {selectedForm === 'documentType' && (
            <>
              <Form.Input label="Document Type Name" name="name" required onChange={this.handleInputChange} />
              <Form.TextArea label="Description" name="description" onChange={this.handleInputChange} />
              <Form.Input label="Document Category" name="documentCategory" required onChange={this.handleInputChange} />
            </>
          )}

          {selectedForm === 'documentReference' && (
            <>
              <Form.Input label="Document Reference ID" name="documentReferenceID" required onChange={this.handleInputChange} />
              <Form.Input label="Document ID" name="documentID" required onChange={this.handleInputChange} />
              <Form.Field
                control={Dropdown}
                label="Document Type"
                name="documentTypeID"
                selection
                options={documentTypeOptions}
                value={documentTypeID || ''}
                onChange={this.handleDropdownChange}
              />
            </>
          )}

          <Button color="blue" floated="right" disabled={!selectedForm}>
            Submit
          </Button>
        </Form>

        <Modal open={showModal} size="small">
          <Modal.Header>Confirmation</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to submit?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={() => this.setState({ showModal: false })}>No</Button>
            <Button positive onClick={this.confirmSubmit}>Yes</Button>
          </Modal.Actions>
        </Modal>

        {formSuccessMessage && (
          <Message success header="Success!" content={formSuccessMessage} />
        )}
        {formErrorMessage && (
          <Message warning header="Error!" content={formErrorMessage} />
        )}
      </Container>
    );
  }
}

export default DocumentForm;
