import React, { Component } from 'react';
import { Message, Button, Form, Select, Modal, Icon } from 'semantic-ui-react';
import axios from 'axios';

const priorityOptions = [
  { key: 'cr', text: 'Critical', value: 'Critical' },
  { key: 'hi', text: 'High', value: 'High' },
  { key: 'me', text: 'Medium', value: 'Medium' },
  { key: 'lo', text: 'Low', value: 'Low' },
];

const MAX_QUANTITY = 10;

class FormUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.userData?._id || null,
      name: props.userData?.name || '',
      processOwner: props.userData?.processOwner || '',
      processDescription: props.userData?.processDescription || '',
      priorityLevel: props.userData?.priorityLevel || '',
      deadline: props.userData?.deadline || '',
      documentTypes: [],
      documents: [{ documentID: null, name: '', quantity: 1 }],
      formClassName: '',
      formSuccessMessage: '',
      formErrorMessage: '',
      showModal: false,
      loadingDocuments: true,
    };
  }

  componentDidMount() {
    this.fetchDocumentTypes();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userData !== this.props.userData) {
      this.setState({
        id: this.props.userData?._id || null,
        name: this.props.userData?.name || '',
        processOwner: this.props.userData?.processOwner || '',
        processDescription: this.props.userData?.processDescription || '',
        priorityLevel: this.props.userData?.priorityLevel || '',
        deadline: this.props.userData?.deadline || '',
      });
    }
  }

  fetchDocumentTypes = async () => {
    try {
      const response = await axios.get('http://nhtridevsrv.nht.gov.jm:8777/api/v1/GetAllDocuments');

      const docs = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : [];

      const options = docs.map(doc => ({
        key: doc.documentID,
        text: doc.name,
        value: doc.documentID,
        name: doc.name
      }));

      this.setState({
        documentTypes: options,
        loadingDocuments: false
      });
    } catch (error) {
      console.error(' Failed to fetch documents:', error);
      this.setState({ documentTypes: [], loadingDocuments: false });
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSelectChange = (e, { value }) => {
    this.setState({ priorityLevel: value });
  };

  handleDocumentChange = (index, field, value) => {
    const updatedDocuments = [...this.state.documents];

    if (field === 'documentID') {
      if (updatedDocuments.some((doc, idx) => idx !== index && doc.documentID === value)) {
        this.setState({
          formClassName: 'warning',
          formErrorMessage: 'Each document type can only be selected once.'
        });
        return;
      }
      const selectedDoc = this.state.documentTypes.find(doc => doc.value === value);
      updatedDocuments[index] = {
        ...updatedDocuments[index],
        documentID: value,
        name: selectedDoc?.text || ''
      };
    } else if (field === 'quantity') {
      const qty = parseInt(value);
      updatedDocuments[index][field] = qty > MAX_QUANTITY ? MAX_QUANTITY : qty;
    } else {
      updatedDocuments[index][field] = value;
    }

    this.setState({ documents: updatedDocuments, formErrorMessage: '', formClassName: '' });
  };

  addDocumentRow = () => {
    this.setState((prevState) => ({
      documents: [...prevState.documents, { documentID: null, name: '', quantity: 1 }],
    }));
  };

  removeDocumentRow = (index) => {
    const updatedDocuments = [...this.state.documents];
    updatedDocuments.splice(index, 1);
    this.setState({ documents: updatedDocuments });
  };

  handleSubmit = async () => {
    const formattedDeadline = new Date(this.state.deadline).toISOString();

    const collectionDetails = this.state.documents.map(doc => ({
      documentID: doc.documentID,
      quantityRequired: parseInt(doc.quantity)
    }));

    const payload = {
      name: this.state.name,
      processOwner: this.state.processOwner,
      processDescription: this.state.processDescription,
      priorityLevel: this.state.priorityLevel,
      deadline: formattedDeadline,
      collectionDetails: collectionDetails,
    };
    console.log(payload);

    const isEditing = !!this.state.id;
    const endpoint = isEditing
      ? `http://nhtridevsrv.nht.gov.jm:8777/api/v1/UpdateBusinessProcess?id=${this.state.id}`
      : 'http://nhtridevsrv.nht.gov.jm:8777/api/v1/AddBusinessProcess';

    try {
      await axios({
        method: isEditing ? 'PUT' : 'POST',
        url: endpoint,
        data: payload,
      });

      this.setState({
        formClassName: 'success',
        formSuccessMessage: isEditing
          ? 'Business process updated successfully!'
          : 'Business process added successfully!',
        showModal: false,
      });

      setTimeout(() => {
        window.location.reload();
      }, 5000);

      this.props.onUserUpdated();
      this.props.onClose();
    } catch (err) {
      console.error(' Submission Error:', err.response?.data || err);
      this.setState({
        formClassName: 'warning',
        formErrorMessage: err.response?.data?.errors?.[0] || 'Something went wrong. Please try again.',
      });
    }
  };

  handleConfirm = () => this.setState({ showModal: true });
  handleCancel = () => this.setState({ showModal: false });

  render() {
    return (
      <>
        <Form className={this.state.formClassName} onSubmit={(e) => { e.preventDefault(); this.handleConfirm(); }}>
          <Form.Input label="Process Name" name="name" required value={this.state.name} onChange={this.handleInputChange} />
          <Form.Input label="Process Owner" name="processOwner" required value={this.state.processOwner} onChange={this.handleInputChange} />
          <Form.Input label="Process Description" name="processDescription" required value={this.state.processDescription} onChange={this.handleInputChange} />
          <Form.Field control={Select} label="Priority Level" options={priorityOptions} required value={this.state.priorityLevel} onChange={this.handleSelectChange} />
          <Form.Input label="Created Date" type="datetime-local" name="deadline" required value={this.state.deadline} onChange={this.handleInputChange} />

          <Form.Field>
            <label>Documents</label>
            {this.state.documents.map((doc, index) => (
              <Form.Group widths="equal" key={index}>
                <Form.Select
                  fluid
                  label="Document Name"
                  placeholder="Select a document"
                  options={this.state.documentTypes}
                  value={doc.documentID || ''}
                  onChange={(e, { value }) => this.handleDocumentChange(index, 'documentID', value)}
                  loading={this.state.loadingDocuments}
                  disabled={this.state.loadingDocuments}
                  required
                />
                <Form.Input
                  label="Quantity"
                  type="number"
                  min="1"
                  max={MAX_QUANTITY}
                  value={doc.quantity}
                  onChange={(e) => this.handleDocumentChange(index, 'quantity', e.target.value)}
                  required
                />
                <Button
                  type="button"
                  icon="trash"
                  color="red"
                  onClick={() => this.removeDocumentRow(index)}
                  disabled={this.state.documents.length === 1}
                />
              </Form.Group>
            ))}
            <Button type="button" icon labelPosition="left" onClick={this.addDocumentRow}>
              <Icon name="plus" />
              Add Document
            </Button>
          </Form.Field>

          {this.state.formSuccessMessage && (
            <Message success color="green" header="Success!" content={this.state.formSuccessMessage} />
          )}
          {this.state.formErrorMessage && (
            <Message warning color="yellow" header="Warning!" content={this.state.formErrorMessage} />
          )}

          <Button color={this.props.buttonColor} floated="right">
            {this.state.id ? 'Update Business Process' : 'Add New Business Process'}
          </Button>
        </Form>

        <Modal open={this.state.showModal} onClose={this.handleCancel} size="small">
          <Modal.Header>Confirmation</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to {this.state.id ? 'update' : 'add'} this business process?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={this.handleCancel}>No</Button>
            <Button color="green" onClick={this.handleSubmit}>Yes</Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default FormUser;
