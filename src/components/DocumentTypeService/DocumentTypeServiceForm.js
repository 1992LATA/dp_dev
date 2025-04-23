import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Message, Dropdown } from 'semantic-ui-react';
import axios from 'axios';

const isActiveOptions = [
  { key: 'true', text: 'True', value: true },
  { key: 'false', text: 'False', value: false }
];

const DocumentTypeServiceForm = ({
  headerTitle,
  buttonTriggerTitle,
  buttonSubmitTitle,
  buttonColor,
  editData = null,
  isEditMode = false,
  onClose = () => {}
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');
  const [isActive, setIsActive] = useState(null);
  const [dateCreated, setDateCreated] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [existingDocuments, setExistingDocuments] = useState([]);

  useEffect(() => {
    axios.get('http://nhtridevsrv.nht.gov.jm:8777/api/v1/GetAllDocumentTypes')
      .then((res) => {
        const docs = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
        setExistingDocuments(docs);
      })
      .catch((err) => {
        console.warn('Could not fetch existing document types', err.message);
      });
  }, []);

  useEffect(() => {
    if (isEditMode && editData) {
      setName(editData.name || '');
      setDescription(editData.description || '');
      setDocumentCategory(editData.documentCategory || '');
      setIsActive(editData.isActive);
      setDateCreated(editData.dateCreated?.slice(0, 16) || '');
    } else {
      const now = new Date();
      const formattedNow = now.toISOString().slice(0, 16);
      setDateCreated(formattedNow);
    }
  }, [editData, isEditMode]);

  const isDuplicate = () => {
    return existingDocuments.some((doc) =>
      doc.name?.trim().toLowerCase() === name.trim().toLowerCase() &&
      doc.documentCategory?.trim().toLowerCase() === documentCategory.trim().toLowerCase() &&
      (!isEditMode || doc.documentTypeID !== editData?.documentTypeID)
    );
  };

  const handleSubmit = async () => {
    setFormErrorMessage('');
    setFormSuccessMessage('');

    if (!name.trim() || !documentCategory.trim() || isActive === null || !dateCreated) {
      setFormErrorMessage('All fields including "Is Active" and "Date Created" are required.');
      return;
    }

    if (isDuplicate()) {
      setFormErrorMessage('A document type with this name and category already exists.');
      return;
    }

    const localDate = new Date(dateCreated);
    localDate.setSeconds(0);
    localDate.setMilliseconds(0);

    const now = new Date();
    if (localDate > now) {
      setFormErrorMessage("Date Created cannot be in the future.");
      console.warn("Blocked future date:", {
        selected: localDate.toISOString(),
        now: now.toISOString()
      });
      return;
    }

    const payload = {
      documentTypeID: isEditMode ? editData.documentTypeID : 0,
      name: name.trim(),
      description: description.trim(),
      documentCategory: documentCategory.trim(),
      isActive,
      dateCreated: localDate.toISOString()
    };

    try {
      if (isEditMode) {
        const response = await axios.put(
          `http://nhtridevsrv.nht.gov.jm:8777/api/v1/UpdateDocumentType?id=${editData.documentTypeID}`,
          payload
        );
        setFormSuccessMessage('Document updated successfully!');
        console.log("✅ Document updated successfully:", response.data, payload);
      } else {
        const response = await axios.post(
          'http://nhtridevsrv.nht.gov.jm:8777/api/v1/AddDocumentType',
          payload
        );
        setFormSuccessMessage('Document added successfully!');
        console.log("✅ Document added successfully:", response.data, payload);
      }

      setTimeout(() => {
        setOpen(false);
        onClose();
        window.location.reload(); // Optional: Replace with callback if needed
      }, 2000);
    } catch (error) {
      console.error('Submission failed:', error?.response?.data || error.message);
      setFormErrorMessage(
        error.response?.data?.errors?.[0] ||
        error.response?.data?.responseMessage ||
        'Submission failed. Please try again.'
      );
    }
  };

  return (
    <>
      <Button color={buttonColor} onClick={() => setOpen(true)}>
        {buttonTriggerTitle}
      </Button>

      <Modal open={open} onClose={() => { setOpen(false); onClose(); }} size="tiny">
        <Modal.Header>{headerTitle}</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label="Document Type Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Form.TextArea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Form.Input
              label="Document Category"
              value={documentCategory}
              onChange={(e) => setDocumentCategory(e.target.value)}
              required
            />
            <Form.Field
              control={Dropdown}
              label="Is Active"
              placeholder="Select status"
              fluid
              selection
              options={isActiveOptions}
              value={isActive}
              onChange={(e, { value }) => setIsActive(value)}
              required
            />
            <Form.Input
              type="datetime-local"
              label="Date Created"
              value={dateCreated}
              onChange={(e) => setDateCreated(e.target.value)}
              max={new Date().toISOString().slice(0, 16)}
              required
            />
          </Form>

          {formSuccessMessage && (
            <Message success header="Success!" content={formSuccessMessage} />
          )}
          {formErrorMessage && (
            <Message warning header="Error!" content={formErrorMessage} />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => { setOpen(false); onClose(); }}>Cancel</Button>
          <Button color="green" onClick={handleSubmit}>
            {buttonSubmitTitle}
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default DocumentTypeServiceForm;


import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Message, Dropdown } from 'semantic-ui-react';
import axios from 'axios';

const isActiveOptions = [
  { key: 'true', text: 'True', value: true },
  { key: 'false', text: 'False', value: false }
];

const DocumentTypeServiceForm = ({
  headerTitle,
  buttonTriggerTitle,
  buttonSubmitTitle,
  buttonColor,
  editData = null,
  isEditMode = false,
  onClose = () => {}
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');
  const [isActive, setIsActive] = useState(null);
  const [dateCreated, setDateCreated] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [existingDocuments, setExistingDocuments] = useState([]);

  useEffect(() => {
    axios.get('http://nhtridevsrv.nht.gov.jm:8777/api/v1/GetAllDocumentTypes')
      .then((res) => {
        const docs = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
        setExistingDocuments(docs);
      })
      .catch((err) => {
        console.warn('Could not fetch existing document types', err.message);
      });
  }, []);

  useEffect(() => {
    if (isEditMode && editData) {
      setName(editData.name || '');
      setDescription(editData.description || '');
      setDocumentCategory(editData.documentCategory || '');
      setIsActive(editData.isActive);
      setDateCreated(editData.dateCreated?.slice(0, 16) || '');
    } else {
      const now = new Date();
      const formattedNow = now.toISOString().slice(0, 16);
      setDateCreated(formattedNow);
    }
  }, [editData, isEditMode]);

  const isDuplicate = () => {
    return existingDocuments.some((doc) =>
      doc.name?.trim().toLowerCase() === name.trim().toLowerCase() &&
      doc.documentCategory?.trim().toLowerCase() === documentCategory.trim().toLowerCase() &&
      (!isEditMode || doc.documentTypeID !== editData?.documentTypeID)
    );
  };

  const handleSubmit = async () => {
    setFormErrorMessage('');
    setFormSuccessMessage('');

    if (!name.trim() || !documentCategory.trim() || isActive === null || !dateCreated) {
      setFormErrorMessage('All fields including "Is Active" and "Date Created" are required.');
      return;
    }

    if (isDuplicate()) {
      setFormErrorMessage('A document type with this name and category already exists.');
      return;
    }

    const localDate = new Date(dateCreated);
    localDate.setSeconds(0);
    localDate.setMilliseconds(0);

    const now = new Date();
    if (localDate > now) {
      setFormErrorMessage("Date Created cannot be in the future.");
      console.warn("Blocked future date:", {
        selected: localDate.toISOString(),
        now: now.toISOString()
      });
      return;
    }

    const payload = {
      documentTypeID: isEditMode ? editData.documentTypeID : 0,
      name: name.trim(),
      description: description.trim(),
      documentCategory: documentCategory.trim(),
      isActive,
      dateCreated: localDate.toISOString()
    };

    try {
      if (isEditMode) {
        const response = await axios.put(
          `http://nhtridevsrv.nht.gov.jm:8777/api/v1/UpdateDocumentType?id=${editData.documentTypeID}`,
          payload
        );
        setFormSuccessMessage('Document updated successfully!');
        console.log("✅ Document updated successfully:", response.data, payload);
      } else {
        const response = await axios.post(
          'http://nhtridevsrv.nht.gov.jm:8777/api/v1/AddDocumentType',
          payload
        );
        setFormSuccessMessage('Document added successfully!');
        console.log("✅ Document added successfully:", response.data, payload);
      }

      setTimeout(() => {
        setOpen(false);
        onClose();
        window.location.reload(); // Optional: Replace with callback if needed
      }, 2000);
    } catch (error) {
      console.error('Submission failed:', error?.response?.data || error.message);
      setFormErrorMessage(
        error.response?.data?.errors?.[0] ||
        error.response?.data?.responseMessage ||
        'Submission failed. Please try again.'
      );
    }
  };

  return (
    <>
      <Button color={buttonColor} onClick={() => setOpen(true)}>
        {buttonTriggerTitle}
      </Button>

      <Modal open={open} onClose={() => { setOpen(false); onClose(); }} size="tiny">
        <Modal.Header>{headerTitle}</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label="Document Type Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Form.TextArea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Form.Input
              label="Document Category"
              value={documentCategory}
              onChange={(e) => setDocumentCategory(e.target.value)}
              required
            />
            <Form.Field
              control={Dropdown}
              label="Is Active"
              placeholder="Select status"
              fluid
              selection
              options={isActiveOptions}
              value={isActive}
              onChange={(e, { value }) => setIsActive(value)}
              required
            />
            <Form.Input
              type="datetime-local"
              label="Date Created"
              value={dateCreated}
              onChange={(e) => setDateCreated(e.target.value)}
              max={new Date().toISOString().slice(0, 16)}
              required
            />
          </Form>

          {formSuccessMessage && (
            <Message success header="Success!" content={formSuccessMessage} />
          )}
          {formErrorMessage && (
            <Message warning header="Error!" content={formErrorMessage} />
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => { setOpen(false); onClose(); }}>Cancel</Button>
          <Button color="green" onClick={handleSubmit}>
            {buttonSubmitTitle}
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default DocumentTypeServiceForm;




// import React, { Component } from 'react';
// import { Message, Button, Form, Dropdown, Container, Modal } from 'semantic-ui-react';
// import axios from 'axios';

// const formOptions = [
//   //{ key: 'document', text: 'Add Document', value: 'document' },
//   { key: 'documentType', text: 'Add Document Type', value: 'documentType' },
//   //{ key: 'documentReference', text: 'Add Document Reference', value: 'documentReference' }
// ];

// class DocumentForm extends Component {
//   state = {
//     selectedForm: '',
//     documentTypeOptions: [],
//     documentTypeID: null,
//     documentReferenceID: '',
//     documentID: '',
//     name: '',
//     description: '',
//     documentCategory: '',
//     isActive: true,
//     dateCreated: new Date().toISOString(),
//     formSuccessMessage: '',
//     formErrorMessage: '',
//     showModal: false,
//   };

//   componentDidMount() {
//     this.fetchDocumentTypes();
//   }

//   fetchDocumentTypes = async () => {
//     try {
//       const response = await axios.get('http://nhtridevsrv.nht.gov.jm:8777/api/v1/GetAllDocumentTypes');
//       const documentTypes = response.data?.data || [];

//       const options = documentTypes.map((docType, index) => ({
//         key: index + 1,
//         text: docType,
//         value: docType
//       }));

//       this.setState({
//         documentTypeOptions: options,
//         documentTypeID: options[0]?.value || null
//       });
//     } catch {
//       this.setState({ formErrorMessage: 'Failed to load document types.' });
//     }
//   };

//   handleInputChange = (e) => {
//     const { name, value } = e.target;
//     this.setState({ [name]: value });
//   };

//   handleDropdownChange = (e, { name, value }) => {
//     this.setState({ [name]: value });
//   };

//   handleFormSelection = (e, { value }) => {
//     this.setState({
//       selectedForm: value,
//       formSuccessMessage: '',
//       formErrorMessage: '',
//       name: '',
//       description: '',
//       documentCategory: '',
//       documentID: '',
//       documentReferenceID: '',
//       documentTypeID: this.state.documentTypeOptions[0]?.value || null
//     });
//   };

//   handleSubmit = (e) => {
//     e.preventDefault();
//     this.setState({ showModal: true });
//   };

//   confirmSubmit = async () => {
//     this.setState({ showModal: false });

//     const {
//       selectedForm, name, description, documentTypeID,
//       documentCategory, documentID, documentReferenceID,
//       isActive, dateCreated
//     } = this.state;

//     let payload = {};
//     let apiUrl = '';

//     // Validation & Payload Prep
//     if (selectedForm === 'document') {
//       if (!name.trim() || !description.trim()) {
//         this.setState({ formErrorMessage: 'Document Name and Description are required.' });
//         return;
//       }
//       payload = {
//         documentID: parseInt(documentID, 10) || 0,
//         name: name.trim(),
//         description: description.trim(),
//         documentTypeID,
//         dateCreated,
//         isActive
//       };
//       apiUrl = 'http://nhtridevsrv.nht.gov.jm:8777/api/v1/AddDocument';
//     } else if (selectedForm === 'documentType') {
//       if (!name.trim() || !documentCategory.trim()) {
//         this.setState({ formErrorMessage: 'Type Name and Category are required.' });
//         return;
//       }
//       payload = {
//         documentTypeID: 0,
//         name: name.trim(),
//         description: description.trim(),
//         documentCategory: documentCategory.trim(),
//         isActive,
//         dateCreated
//       };
//       apiUrl = 'http://nhtridevsrv.nht.gov.jm:8777/api/v1/AddDocumentType';
//     } else if (selectedForm === 'documentReference') {
//       payload = {
//         documentReferenceID: parseInt(documentReferenceID, 10) || 0,
//         documentID: parseInt(documentID, 10) || 0,
//         documentTypeID
//       };
//       apiUrl = 'http://nhtridevsrv.nht.gov.jm:8777/api/v1/AddDocumentTypeReference';
//     }

//     try {
//       const response = await axios.post(apiUrl, payload);
//       this.setState({
//         formSuccessMessage: response.data?.responseMessage || 'Successfully submitted!',
//         formErrorMessage: ''
//       });

//       setTimeout(() => {
//         window.location.reload();
//       }, 5000);
//     } catch (err) {
//       this.setState({
//         formErrorMessage: err.response?.data?.message || 'Submission failed. Please try again.'
//       });
//     }
//   };

//   render() {
//     const {
//       selectedForm, documentTypeOptions, documentTypeID, showModal,
//       formSuccessMessage, formErrorMessage
//     } = this.state;

//     return (
//       <Container textAlign="center">
//         <Form onSubmit={this.handleSubmit}>
//           <Form.Field
//             control={Dropdown}
//             label="Select Form Type"
//             options={formOptions}
//             placeholder="Choose a form"
//             selection
//             required
//             value={selectedForm}
//             onChange={this.handleFormSelection}
//           />

//           {selectedForm === 'document' && (
//             <>
//               <Form.Input label="Document Name" name="name" required onChange={this.handleInputChange} />
//               <Form.TextArea label="Description" name="description" required onChange={this.handleInputChange} />
//               <Form.Field
//                 control={Dropdown}
//                 label="Document Type"
//                 name="documentTypeID"
//                 placeholder="Select Document Type"
//                 selection
//                 options={documentTypeOptions}
//                 value={documentTypeID || ''}
//                 onChange={this.handleDropdownChange}
//               />
//             </>
//           )}

//           {selectedForm === 'documentType' && (
//             <>
//               <Form.Input label="Document Type Name" name="name" required onChange={this.handleInputChange} />
//               <Form.TextArea label="Description" name="description" onChange={this.handleInputChange} />
//               <Form.Input label="Document Category" name="documentCategory" required onChange={this.handleInputChange} />
//             </>
//           )}

//           {selectedForm === 'documentReference' && (
//             <>
//               <Form.Input label="Document Reference ID" name="documentReferenceID" required onChange={this.handleInputChange} />
//               <Form.Input label="Document ID" name="documentID" required onChange={this.handleInputChange} />
//               <Form.Field
//                 control={Dropdown}
//                 label="Document Type"
//                 name="documentTypeID"
//                 selection
//                 options={documentTypeOptions}
//                 value={documentTypeID || ''}
//                 onChange={this.handleDropdownChange}
//               />
//             </>
//           )}

//           <Button color="blue" floated="right" disabled={!selectedForm}>
//             Submit
//           </Button>
//         </Form>

//         <Modal open={showModal} size="small">
//           <Modal.Header>Confirmation</Modal.Header>
//           <Modal.Content>
//             <p>Are you sure you want to submit?</p>
//           </Modal.Content>
//           <Modal.Actions>
//             <Button negative onClick={() => this.setState({ showModal: false })}>No</Button>
//             <Button positive onClick={this.confirmSubmit}>Yes</Button>
//           </Modal.Actions>
//         </Modal>

//         {formSuccessMessage && (
//           <Message success header="Success!" content={formSuccessMessage} />
//         )}
//         {formErrorMessage && (
//           <Message warning header="Error!" content={formErrorMessage} />
//         )}
//       </Container>
//     );
//   }
// }

// export default DocumentForm;
