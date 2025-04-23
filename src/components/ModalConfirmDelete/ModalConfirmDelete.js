import React, { Component } from "react";
import { Button, Modal } from "semantic-ui-react";
import axios from "axios";

class ModalConfirmDelete extends Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });

  handleSubmit = async () => {
    try {
      const userID = this.props.user?._id;

      if (!userID) {
        console.error("Error: User ID is undefined.");
        alert("Failed to delete: User ID is missing.");
        return;
      }

      console.log("Attempting to delete user with ID:", userID);

      const deleteURL = `http://nhtridevsrv.nht.gov.jm:8777/api/v1/DeleteBusinessProcess?id=${userID}`;

      const confirmDelete = window.confirm("Are you sure you want to delete this process?");
      if (!confirmDelete) return;

      const response = await axios.delete(deleteURL);

      console.log("Delete Success:", response.data);

      this.handleClose();
      this.props.onUserDeleted(userID);
      this.props.socket?.emit("delete", userID);

    } catch (err) {
      const backendMessage = err?.response?.data?.errors?.[0];
      const fallbackMessage = "Error deleting process. Please try again.";

      console.error("Delete Error:", err.response?.data || err.message || err);

      alert(backendMessage || fallbackMessage);
      this.handleClose();
    }
  };

  render() {
    return (
      <Modal
        trigger={
          <Button onClick={this.handleOpen} color={this.props.buttonColor}>
            {this.props.buttonTriggerTitle}
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        dimmer="inverted"
        size="tiny"
      >
        <Modal.Header>{this.props.headerTitle}</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete <strong>{this.props.user?.name || "this record"}</strong>?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleSubmit} color="red">Yes</Button>
          <Button onClick={this.handleClose} color="black">No</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ModalConfirmDelete;




// import React, { Component } from "react";
// import { Button, Modal } from "semantic-ui-react";
// import axios from "axios";

// class ModalConfirmDelete extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { modalOpen: false };

//     this.handleOpen = this.handleOpen.bind(this);
//     this.handleClose = this.handleClose.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleOpen = () => this.setState({ modalOpen: true });
//   handleClose = () => this.setState({ modalOpen: false });

//   handleSubmit = async () => {
//     try {
//       const userID = this.props.user?._id; // Ensure correct ID is used

//       if (!userID) {
//         console.error("Error: User ID is undefined.");
//         alert("Failed to delete: User ID is missing.");
//         return;
//       }

//       // ✅ Correct Delete API URL
//       const deleteURL = `http://nhtridevsrv.nht.gov.jm:8777/api/v1/DeleteBusinessProcess?id=${userID}`;

//       const confirmDelete = window.confirm("Are you sure you want to delete this process?");
//       if (!confirmDelete) return; // Stop if user cancels

//       const response = await axios.delete(deleteURL);

//       console.log("Delete Success:", response.data);

//       this.handleClose();
//       this.props.onUserDeleted(userID); // Notify parent component
//       this.props.socket.emit("delete", userID); // Emit socket event for deletion

//     } catch (err) {
//       console.error("Delete Error:", err.response?.data || err);
//       alert("Error deleting process. Please try again.");
//       this.handleClose();
//     }
//   };

//   render() {
//     return (
//       <Modal
//         trigger={
//           <Button onClick={this.handleOpen} color={this.props.buttonColor}>
//             {this.props.buttonTriggerTitle}
//           </Button>
//         }
//         open={this.state.modalOpen}
//         onClose={this.handleClose}
//         dimmer="inverted"
//         size="tiny"
//       >
//         <Modal.Header>{this.props.headerTitle}</Modal.Header>
//         <Modal.Content>
//           <p>Are you sure you want to delete <strong>{this.props.user.name}</strong>?</p>
//         </Modal.Content>
//         <Modal.Actions>
//           <Button onClick={this.handleSubmit} color="red">Yes</Button>
//           <Button onClick={this.handleClose} color="black">No</Button>
//         </Modal.Actions>
//       </Modal>
//     );
//   }
// }

// export default ModalConfirmDelete;
