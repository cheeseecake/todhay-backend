import React, { useRef } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { DATA_TYPES } from "../App";
import { createType, deleteType, updateType } from "../api/api";

export const TagsModal = ({ setTag, tag, refreshTags }) => {
  const formRef = useRef();

  const onDelete = () =>
    window.confirm(`Delete ${tag?.title}?`) &&
    deleteType(tag, DATA_TYPES.TAGS).then(() => {
      refreshTags();
      setTag(null);
    });

  const onSubmit = () => {
    const id = tag?.id;

    const tagData = {
      title: formRef.current.title.value,
      topic: formRef.current.topic.value
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
    <Modal show onHide={() => setTag(null)} size="lg" backdrop="static">
      <Modal.Header closeButton>
        /{DATA_TYPES.TAGS.apiName}/{tag.id || "<New Tag>"}
      </Modal.Header>

      <Modal.Body>
        <Form ref={formRef}>
          <Row>
            <Col md={8}>
              <Form.Group>
                <Form.Label for="title">Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  defaultValue={tag?.title}
                  placeholder="Title"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label for="topic">Topic</Form.Label>
                <Form.Select
                  name="topic"
                  defaultValue={tag?.topic}
                >
                  <option value={"true"}>true</option>
                  <option value={"false"}>false</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Form.Group>
              <Form.Label for="description">Description</Form.Label>
              <Form.Control
                style={{ height: "150px" }}
                type="textarea"
                id="description"
                name="description"
                defaultValue={tag?.description}
                placeholder="Description"
              />
            </Form.Group>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={onDelete}>Delete</Button>
        <Button variant="success" onClick={onSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
