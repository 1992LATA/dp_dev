// import React, { Component } from 'react';
// import { Table } from 'semantic-ui-react';
// import axios from 'axios';

// import ModalUser from '../ModalUser/ModalUser';
// import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

// class BusinessProcesse extends Component {
//   state = {
//     users: [],
//   };

//   componentDidMount() {
//     this.fetchBusinessProcesses();
//   }

//   fetchBusinessProcesses = async () => {
//     try {
//       const response = await axios.get(`${this.props.server}/api/v1/GetAllBusinessProcesses`);

//       if (response.data && response.data.data) {
//         const formattedUsers = response.data.data.map((process) => ({
//           _id: process.processID,
//           name: process.name,
//           owner: process.processOwner,
//           description: process.processDescription,
//           status: process.isActive ? 'Active' : 'Inactive',
//         }));

//         this.setState({ users: formattedUsers });
//       } else {
//         console.error('Invalid data format received:', response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching business processes:', error);
//     }
//   };

//   handleAddProcess = async (processData) => {
//     try {
//       const currentDate = new Date();
//       const formattedDate = currentDate.toISOString().split('.')[0] + 'Z'; // Ensure correct UTC format

//       const payload = {
//         processID: 0,
//         name: processData.name,
//         dateCreated: formattedDate,
//         isActive: processData.inActive,
//         processOwner: processData.processOwner || 'Default Owner',
//         processDescription: processData.processDescription,
//       };

//       const response = axios.post('http://nhtridevsrv.nht.gov.jm:8777/api/v1/AddBusinessProcess', payload);

//       if (response.data && response.data.responseMessage === 'Success') {
//         this.fetchBusinessProcesses();
//       } else {
//         console.error('Error adding business process:', response.data);
//       }
//     } catch (error) {
//       console.error('Error adding business process:', error);
//     }
//   };

//   render() {
//     const { users } = this.state;

//     return (
//       <div>
//         <h2>Business Processes</h2>
//         <Table singleLine>
//           <Table.Header>
//             <Table.Row>
//               <Table.HeaderCell>Process</Table.HeaderCell>
//               <Table.HeaderCell>Owner</Table.HeaderCell>
//               <Table.HeaderCell>Description</Table.HeaderCell>
//               <Table.HeaderCell>Status</Table.HeaderCell>
//               <Table.HeaderCell>Actions</Table.HeaderCell>
//             </Table.Row>
//           </Table.Header>
//           <Table.Body>
//             {users.map((user) => (
//               <Table.Row key={user._id}>
//                 <Table.Cell>{user.name}</Table.Cell>
//                 <Table.Cell>{user.owner}</Table.Cell>
//                 <Table.Cell>{user.description}</Table.Cell>
//                 <Table.Cell>{user.status}</Table.Cell>
//                 <Table.Cell>
//                   <ModalUser
//                     headerTitle="Edit Process"
//                     buttonTriggerTitle="Edit"
//                     buttonSubmitTitle="Save"
//                     buttonColor="blue"
//                     userID={user._id}
//                     onUserUpdated={this.fetchBusinessProcesses}
//                     server={this.props.server}
//                     socket={this.props.socket}
//                   />
//                   <ModalConfirmDelete
//                     headerTitle="Delete Process"
//                     buttonTriggerTitle="Delete"
//                     buttonColor="black"
//                     user={user}
//                     onUserDeleted={this.fetchBusinessProcesses}
//                     server={this.props.server}
//                     socket={this.props.socket}
//                   />
//                 </Table.Cell>
//               </Table.Row>
//             ))}
//           </Table.Body>
//         </Table>
//       </div>
//     );
//   }
// }

// export default BusinessProcesse;


import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import axios from 'axios';

import ModalUser from '../ModalUser/ModalUser';
import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

class BusinessProcesse extends Component {
  state = {
    users: [], // Array of formatted business processes
    errorMessage: '', // For displaying errors to the user
  };

  componentDidMount() {
    console.log('Component mounted.');
    this.fetchBusinessProcesses();
  }

  fetchBusinessProcesses = async () => {
    try {
      console.log('Fetching business processes...');
      const response = await axios.get(`${this.props.server}/api/v1/GetAllBusinessProcesses`);
      console.log('API Response:', response.data);

      // Validate and format the data
      if (response.data && response.data.data) {
        const formattedUsers = response.data.data.map((process) => ({
          _id: process.processID, // Unique identifier
          name: process.name || 'N/A', // Fallback if name is missing
          owner: process.processOwner || 'Unknown', // Fallback if owner is missing
          description: process.processDescription || 'No description available', // Fallback if description is empty
          status: process.isActive ? 'Active' : 'Inactive', // Determine status
        }));

        this.setState({ users: formattedUsers, errorMessage: '' });
      } else {
        console.error('Invalid data format received:', response.data);
        this.setState({ errorMessage: 'Invalid data format received from API.' });
      }
    } catch (error) {
      console.error('Error fetching business processes:', error.response || error.message);
      this.setState({ errorMessage: 'Failed to fetch business processes. Please try again later.' });
    }
  };

  handleAddProcess = async (processData) => {
    try {
      console.log('Adding new business process...');
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString(); // ISO 8601 format for date

      const payload = {
        processID: 0,
        name: processData.name,
        dateCreated: formattedDate,
        isActive: processData.inActive,
        processOwner: processData.processOwner || 'Default Owner',
        processDescription: processData.processDescription,
      };

      const response = await axios.post(`${this.props.server}/api/v1/AddBusinessProcess`, payload);

      if (response.data && response.data.responseMessage === 'Success') {
        console.log('Business process added successfully.');
        this.fetchBusinessProcesses(); // Refresh the list
      } else {
        console.error('Error adding business process:', response.data);
        this.setState({ errorMessage: 'Failed to add business process. Please try again.' });
      }
    } catch (error) {
      console.error('Error adding business process:', error.response || error.message);
      this.setState({ errorMessage: 'Failed to add business process. Please try again.' });
    }
  };

  render() {
    const { users, errorMessage } = this.state;

    return (
      <div>
        <h2>Business Processes</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <Table singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Process</Table.HeaderCell>
              <Table.HeaderCell>Owner</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.length > 0 ? (
              users.map((user) => (
                <Table.Row key={user._id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.owner}</Table.Cell>
                  <Table.Cell>{user.description}</Table.Cell>
                  <Table.Cell>{user.status}</Table.Cell>
                  <Table.Cell>
                    <ModalUser
                      headerTitle="Edit Process"
                      buttonTriggerTitle="Edit"
                      buttonSubmitTitle="Save"
                      buttonColor="blue"
                      userID={user._id}
                      onUserUpdated={this.fetchBusinessProcesses}
                      server={this.props.server}
                      socket={this.props.socket}
                    />
                    <ModalConfirmDelete
                      headerTitle="Delete Process"
                      buttonTriggerTitle="Delete"
                      buttonColor="black"
                      user={user}
                      onUserDeleted={this.fetchBusinessProcesses}
                      server={this.props.server}
                      socket={this.props.socket}
                    />
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="5" style={{ textAlign: 'center' }}>
                  No business processes found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default BusinessProcesse;
