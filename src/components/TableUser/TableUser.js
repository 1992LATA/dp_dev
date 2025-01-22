// import React, { Component } from 'react';
// import { Table } from 'semantic-ui-react';

// import ModalUser from '../ModalUser/ModalUser';
// import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

// class TableUser extends Component {

//   render() {

//     let users = this.props.users;

//     users = users.map((user) => 
//       <Table.Row key={user._id}>
//         <Table.Cell>{user.name}</Table.Cell>
//         <Table.Cell>{user.owner}</Table.Cell>
//         <Table.Cell>{user.description}</Table.Cell>
//         <Table.Cell>{user.status}</Table.Cell>
//         <Table.Cell>
//           <ModalUser
//             headerTitle='Edit Process'
//             buttonTriggerTitle='Edit'
//             buttonSubmitTitle='Save'
//             buttonColor='blue'
//             userID={user._id}
//             onUserUpdated={this.props.onUserUpdated}
//             server={this.props.server}
//             socket={this.props.socket}
//           />
//           <ModalConfirmDelete
//             headerTitle='Delete User'
//             buttonTriggerTitle='Delete'
//             buttonColor='black'
//             user={user}
//             onUserDeleted={this.props.onUserDeleted}
//             server={this.props.server}
//             socket={this.props.socket}
//           />
//         </Table.Cell>
//       </Table.Row>
//     );

//     // Make every new user appear on top of the list
//     users =  [...users].reverse();

//     return (
//       <Table singleLine>
//         <Table.Header>
//           <Table.Row>
//             <Table.HeaderCell>Process</Table.HeaderCell>
//             <Table.HeaderCell>Owner</Table.HeaderCell>
//             <Table.HeaderCell>Description</Table.HeaderCell>
//             <Table.HeaderCell>Status</Table.HeaderCell>
//             <Table.HeaderCell>Actions</Table.HeaderCell>
//           </Table.Row>
//         </Table.Header>
//         <Table.Body>
//           {users}
//         </Table.Body>
//       </Table>
//     );
//   }
// }

// export default TableUser;

import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import axios from 'axios';

import ModalUser from '../ModalUser/ModalUser';
import ModalConfirmDelete from '../ModalConfirmDelete/ModalConfirmDelete';

class TableUser extends Component {
  state = {
    users: [],
  };

  componentDidMount() {
    this.fetchBusinessProcesses();
  }

  fetchBusinessProcesses = async () => {
    try {
      const response = await axios.get('http://nhtridevsrv.nht.gov.jm:8777/api/v1/GetAllBusinessProcesses');

      if (response.data && response.data.data) {
        const formattedUsers = response.data.data.map((process) => ({
          _id: process.processID,
          name: process.name,
          owner: process.processOwner,
          description: process.processDescription,
          status: process.isActive ? 'Active' : 'Inactive',
        }));

        this.setState({ users: formattedUsers });
      } else {
        console.error('Invalid data format received:', response.data);
      }
    } catch (error) {
      console.error('Error fetching business processes:', error);
    }
  };

  render() {
    const { users } = this.state;

    const userRows = users.map((user) => (
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
            headerTitle="Delete User"
            buttonTriggerTitle="Delete"
            buttonColor="black"
            user={user}
            onUserDeleted={this.fetchBusinessProcesses}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Table.Cell>
      </Table.Row>
    ));

    return (
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
        <Table.Body>{userRows}</Table.Body>
      </Table>
    );
  }
}

export default TableUser;

