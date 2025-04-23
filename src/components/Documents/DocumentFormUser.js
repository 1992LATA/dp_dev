import React, { Component } from 'react';
import { Table, Dropdown, Form, Button, Message, Select } from 'semantic-ui-react';
import axios from 'axios';

const statusOptions = [
  { key: 'ac', text: 'Active', value: true },
  { key: 'in', text: 'Inactive', value: false },
];

class DocumentTableUser extends Component {
  state = {
    documents: [],
    selectedDocument: null,
    formData: {
      documentID: 0,
      name: '',
      description: '',
      documentTypeID: 0,
      dateCreated: new Date().toISOString(),
    },
    documentTypes: [],
    formClassName: '',
    formSuccessMessage: '',
    formErrorMessage: '',
  };

  componentDidMount() {
    this.fetchDocuments();
    this.fetchDocumentTypes();
  }

  fetchDocuments = async () => {
    try {
      const response = await axios.get('http://nhtridevsrv.nht.gov.jm:8777/api/v1/GetAllDocuments');
      if (response.data && response.data.data) {
        this.setState({ documents: response.data.data });
      } else {
        console.error('Invalid data format received:', response.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  fetchDocumentTypes = async () => {
    try {
      const response = await axios.get('http://nhtridevsrv.nht.gov.jm:8777/api/v1/GetAllDocumentTypes');
      if (response.data && response.data.data) {
        this.setState({ documentTypes: response.data.data });
      } else {
        console.error('Invalid document types format received:', response.data);
      }
    } catch (error) {
      console.error('Error fetching document types:', error);
    }
  };

  handleDropdownChange = (e, { value }) => {
    const selectedDoc = this.state.documents.find(doc => doc.documentID === value);
    this.setState({ selectedDocument: selectedDoc, formData: { ...selectedDoc } });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: { ...prevState.formData, [name]: value },
    }));
  };

  handleSelectChange = (e, { value }) => {
    this.setState((prevState) => ({
      formData: { ...prevState.formData, documentTypeID: value },
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = 'http://nhtridevsrv.nht.gov.jm:8777/api/v1/AddDocument';
      const response = await axios.post(endpoint, this.state.formData);
      this.setState({
        formClassName: 'success',
        formSuccessMessage: response.data.responseMessage || 'Document successfully added!',
        selectedDocument: null,
      });
      this.fetchDocuments();
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.join(', ') || 'Something went wrong.';
      this.setState({
        formClassName: 'warning',
        formErrorMessage: errorMsg,
      });
    }
  };

  render() {
    const { documents, selectedDocument, formData, formClassName, formSuccessMessage, formErrorMessage, documentTypes } = this.state;

    const documentOptions = documents.map(doc => ({
      key: doc.documentID,
      text: doc.name,
      value: doc.documentID,
    }));

    const documentTypeOptions = documentTypes.map(type => ({
      key: type.documentTypeID,
      text: type.name,
      value: type.documentTypeID,
    }));

    return (
      <div>
        <Dropdown
          placeholder="Select Document"
          fluid
          selection
          options={documentOptions}
          onChange={this.handleDropdownChange}
        />

        {selectedDocument && (
          <Form className={formClassName} onSubmit={this.handleSubmit}>
            <Form.Input
              label="Name"
              type="text"
              placeholder="Document Name"
              name="name"
              value={formData.name}
              onChange={this.handleInputChange}
            />
            <Form.Input
              label="Description"
              type="text"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={this.handleInputChange}
            />
            <Form.Field
              control={Select}
              label="Document Type"
              options={documentTypeOptions}
              placeholder="Select Document Type"
              required
              value={formData.documentTypeID}
              onChange={this.handleSelectChange}
            />
            <Message success color="green" header="Success!" content={formSuccessMessage} />
            <Message warning color="yellow" header="Warning!" content={formErrorMessage} />
            <Button color="blue" floated="right">Submit</Button>
          </Form>
        )}
      </div>
    );
  }
}

export default DocumentTableUser;