import React, { Component } from 'react';
import { Message, Button, Form, Select } from 'semantic-ui-react';
import axios from 'axios';

// Dropdown options for status
const statusOptions = [
  { key: 'ac', text: 'Active', value: true },
  { key: 'in', text: 'Inactive', value: false },
];

class FormUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      status: true, // Default to "Active"
      processOwner: '',
      formClassName: '',
      formSuccessMessage: '',
      formErrorMessage: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    if (this.props.userID) {
      axios
        .get(`${this.props.server}/api/users/${this.props.userID}`)
        .then((response) => {
          this.setState({
            name: response.data.name,
            description: response.data.description ?? '',
            status: response.data.isActive,
            processOwner: response.data.processOwner || '',
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleSelectChange(e, data) {
    this.setState({ status: data.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    // Validate inputs
    if (!this.state.name || !this.state.description || this.state.status === '') {
      this.setState({
        formClassName: 'warning',
        formErrorMessage: 'Please fill out all fields: Name, Description, Status, and Process Owner.',
      });
      return;
    }

    if (this.state.status === false) {
      this.setState({
        formClassName: 'warning',
        formErrorMessage: 'Business process must be active upon creation.',
      });
      return;
    }

    const payload = {
      processID: 0, // Always 0 for new records
      name: this.state.name,
      dateCreated: new Date().toISOString(), // Ensure accurate date
      isActive: this.state.status, // true or false
      processOwner: this.state.processOwner || 'Default Owner', // Provide a fallback if empty
      processDescription: this.state.description,
    };

    const endpoint = 'http://nhtridevsrv.nht.gov.jm:8777/api/v1/AddBusinessProcess';

    axios
      .post(endpoint, payload)
      .then((response) => {
        this.setState({
          formClassName: 'success',
          formSuccessMessage: response.data.msg || 'Process successfully added!',
          name: '',
          description: '',
          status: true, // Reset to default active status
          processOwner: '',
        });

        if (this.props.socket) {
          this.props.socket.emit('add', response.data.result);
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.msg || 'Something went wrong. Please try again.';
        console.error('API Error:', err.response?.data || err);
        this.setState({
          formClassName: 'warning',
          formErrorMessage: errorMsg,
        });
      });
  }

  render() {
    const { formClassName, formSuccessMessage, formErrorMessage } = this.state;

    return (
      <Form className={formClassName} onSubmit={this.handleSubmit}>
        <Form.Input
          label="Name"
          type="text"
          placeholder="e.g. Loan Application"
          name="name"
          maxLength="40"
          required
          value={this.state.name}
          onChange={this.handleInputChange}
        />
        <Form.Input
          label="Process Owner"
          type="text"
          placeholder="e.g. John Doe"
          name="processOwner"
          required
          value={this.state.processOwner}
          onChange={this.handleInputChange}
        />
        <Form.Group widths="equal">
          <Form.Input
            label="Description"
            type="text"
            placeholder="Description"
            name="description"
            required
            value={this.state.description}
            onChange={this.handleInputChange}
          />
          <Form.Field
            control={Select}
            label="Status"
            options={statusOptions}
            placeholder="Select Status"
            required
            value={this.state.status}
            onChange={this.handleSelectChange}
          />
        </Form.Group>
        <Message success color="green" header="Success!" content={formSuccessMessage} />
        <Message warning color="yellow" header="Warning!" content={formErrorMessage} />
        <Button color={this.props.buttonColor} floated="right">
          {this.props.buttonSubmitTitle}
        </Button>
        <br />
        <br />
      </Form>
    );
  }
}

export default FormUser;
