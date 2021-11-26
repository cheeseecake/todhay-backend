import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import React, { useRef } from "react";
import { DATA_TYPES } from "../App";
import { createType, deleteType, updateType } from "../api/api";

export const TagsModal = ({ setTag, tag, refreshTags }) => {
  const formRef = useRef();

  const onDelete = () =>
    window.confirm(`Delete ${tag?.title}?`) &&
    deleteType(tag, DATA_TYPES.TAGS).then(refreshTags);

  const onSubmit = () => {
    const id = tag?.id;

    const tagData = {
      title: formRef.current.title.value,
    };

    const operation = id
      ? updateType({ id, ...tagData }, DATA_TYPES.TAGS) // Existing wish
      : createType(tagData, DATA_TYPES.TAGS); // New wish

    operation
      .then(() => {
        refreshTags();
        setTag(null);
      })
      .catch(alert);
  };

  return (
    <Modal isOpen toggle={() => setTag(null)} className="modal-lg">
      <ModalHeader>
        /{DATA_TYPES.TAGS.apiName}/{tag.id || "<New Tag>"}
      </ModalHeader>

      <ModalBody>
        <Form innerRef={formRef}>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              type="text"
              name="title"
              defaultValue={tag?.title}
              placeholder="Title"
              required
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onDelete}>Delete</Button>
        <Button color="primary" onClick={onSubmit}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};
