// import React, { Component } from 'react';
// import { Message, Button, Form, Select } from 'semantic-ui-react';
// import axios from 'axios';

// const genderOptions = [
//   { key: 'ac', text: 'Active', value: 'ac' },
//   { key: 'in', text: 'Inactive', value: 'in' },
//   // { key: 'o', text: 'Do Not Disclose', value: 'o' }
// ]

// class FormUser extends Component {

//   constructor(props) {
//     super(props);
    
//     this.state = {
//       name: '',
//       email: '',
//       description: '',
//       status: '',
//       formClassName: '',
//       formSuccessMessage: '',
//       formErrorMessage: ''
//     }

//     this.handleInputChange = this.handleInputChange.bind(this);
//     this.handleSelectChange = this.handleSelectChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   componentWillMount() {
//     // Fill in the form with the appropriate data if user id is provided
//     if (this.props.userID) {
//       axios.get(`${this.props.server}/api/users/${this.props.userID}`)
//       .then((response) => {
//         this.setState({
//           name: response.data.name,
//           email: response.data.email,
//           description: response.data.description ?? '',
//           status: response.data.status,
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     }
//   }

//   handleInputChange(e) {
//     const target = e.target;
//     const value = target.type === 'checkbox' ? target.checked : target.value;
//     const name = target.name;

//     this.setState({ [name]: value });
//   }

//   handleSelectChange(e, data) {
//     this.setState({ gender: data.value });
//   }

//   handleSubmit(e) {
//     // Prevent browser refresh
//     e.preventDefault();

//     // Client-side validation: Check if any of the fields are empty
//     if (!this.state.name || !this.state.email || !this.state.description || !this.state.status) {
//       this.setState({
//         formClassName: 'warning',
//         formErrorMessage: 'Please fill out all fields: Name, N/A-Email, Description, and Status.'
//       });
//       return; // Stop further execution
//     }

//     const user = {
//       name: this.state.name,
//       email: this.state.email,
//       description: this.state.description,
//       status: this.state.status
//     }

//     // Acknowledge that if the user id is provided, we're updating via PUT
//     // Otherwise, we're creating a new data via POST
//     const method = this.props.userID ? 'put' : 'post';
//     const params = this.props.userID ? this.props.userID : '';

//     axios({
//       method: method,
//       responseType: 'json',
//       url: `${this.props.server}/api/users/${params}`,
//       data: user
//     })
//     .then((response) => {
//       this.setState({
//         formClassName: 'success',
//         formSuccessMessage: response.data.msg
//       });

//       if (!this.props.userID) {
//         this.setState({
//           name: '',
//           //email: '',
//           description: '',
//           status: ''
//         });
//         this.props.onUserAdded(response.data.result);
//         this.props.socket.emit('add', response.data.result);
//       }
//       else {
//         this.props.onUserUpdated(response.data.result);
//         this.props.socket.emit('update', response.data.result);
//       }
      
//     })
//     .catch((err) => {
//       if (err.response) {
//         if (err.response.data) {
//           this.setState({
//             formClassName: 'warning',
//             formErrorMessage: err.response.data.msg
//           });
//         }
//       }
//       else {
//         this.setState({
//           formClassName: 'warning',
//           formErrorMessage: 'Something went wrong. ' + err
//         });
//       }
//     });
//   }

//   render() {

//     const formClassName = this.state.formClassName;
//     const formSuccessMessage = this.state.formSuccessMessage;
//     const formErrorMessage = this.state.formErrorMessage;

//     return (
//       <Form className={formClassName} onSubmit={this.handleSubmit}>
//         <Form.Input
//           label='Name '
//           type='text'
//           placeholder='e.g. Loan Application'
//           name='name'
//           maxLength='40'
//           required
//           value={this.state.name}
//           onChange={this.handleInputChange}
//         />
//         {/* <Form.Input
//           label='Email *'
//           type='email'
//           placeholder='elonmusk@tesla.com'
//           name='email'
//           maxLength='40'
//           required
//           value={this.state.email}
//           onChange={this.handleInputChange}
//         /> */}
//         <Form.Group widths='equal'>
//           <Form.Input
//             label='Description '
//             type='text'
//             placeholder='description'
//             min={5}
//             max={130}
//             name='description'
//             required
//             value={this.state.description}
//             onChange={this.handleInputChange}
//           />
//           <Form.Field
//             control={Select}
//             label='Status'
//             options={genderOptions}
//             placeholder='status'
//             required
//             value={this.state.Status}
//             onChange={this.handleSelectChange}
//           />
//         </Form.Group>
//         <Message
//           success
//           color='green'
//           header='Nice one!'
//           content={formSuccessMessage}
//         />
//         <Message
//           warning
//           color='yellow'
//           header='Woah!'
//           content={formErrorMessage}
//         />
//         <Button color={this.props.buttonColor} floated='right'>{this.props.buttonSubmitTitle}</Button>
//         <br /><br /> {/* Yikes! Deal with Semantic UI React! */}
//       </Form>
//     );
//   }
// }

// export default FormUser;

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
      status: '',
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

    if (!this.state.name || !this.state.description || this.state.status === '') {
      this.setState({
        formClassName: 'warning',
        formErrorMessage: 'Please fill out all fields: Name, Description, Status, and Process Owner.',
      });
      return;
    }

    const payload = {
      processID: 0, // Always 0 for new records
      name: this.state.name,
      dateCreated: new Date().toISOString(), // Current timestamp
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
          status: '',
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
