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

