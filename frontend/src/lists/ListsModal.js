import format from "date-fns/format";
import React, { useRef } from "react";
import Select from "react-select";
import { Button, Row, Col, Form, Modal } from "react-bootstrap";
import { createType, deleteType, updateType } from "../api/api";
import { DATA_TYPES } from "../App";

export const ListsModal = ({ list, setList, tags, refreshLists }) => {
  const formRef = useRef();

  const onDelete = () =>
    window.confirm(`Delete '${list.title}?'`) &&
    deleteType(list, DATA_TYPES.LISTS).then(() => {
      refreshLists();
      setList(null);
    });

  const onSubmit = () => {
    const id = list?.id;

    const listData = {
      title: formRef.current.title.value,
      /* In HTML, the options of a select element are not an array (although 'array-like'),
      and here the ... destructuring operator is used to coerce it into an array,
      so we can iterate through it */
      tags: formRef.current.tags.length > 1
        ? Array.from(formRef.current.tags, (tag) => parseInt(tag.value))
        : formRef.current.tags.value
          ? [parseInt(formRef.current.tags.value)]
          : []
      ,
      description: formRef.current.description.value,
      start_date: formRef.current.start_date.value || null,
      due_date: formRef.current.due_date.value || null,
      completed_date: formRef.current.completed_date.value || null,
    };

    const operation = id
      ? updateType({ id, ...listData }, DATA_TYPES.LISTS) // Existing list
      : createType(listData, DATA_TYPES.LISTS); // New list

    operation
      .then(() => {
        refreshLists();
        setList(null);
      })
      .catch(alert);
  };

  return (
    <Modal show onHide={() => setList(null)} size="lg" backdrop="static">
      <Modal.Header closeButton>
        /{DATA_TYPES.LISTS.apiName}/{list.id || "<New List>"}
      </Modal.Header>
      <Modal.Body>
        <Form ref={formRef}>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label for="title">Title</Form.Label>
                <Form.Control
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={list?.title}
                  placeholder="Title"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label for="tags">Tags</Form.Label>
                <Select
                  name="tags"
                  placeholder="Tags"
                  closeMenuOnSelect={false}
                  isMulti
                  defaultValue={tags
                    .filter((tag) => list.tags?.includes(tag.id))
                    .map((tag) => ({ value: tag.id, label: tag.title }))}
                  options={tags
                    .map((tag) => ({ value: tag.id, label: tag.title }))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <Form.Label for="description">Description</Form.Label>
            <Form.Control
              type="textarea"
              id="description"
              name="description"
              defaultValue={list?.description}
              placeholder="Description"
            />
          </Form.Group>

          <Row form>
            <Col md={4}>
              <Form.Group>
                <Form.Label for="start_date">Start Date</Form.Label>
                <Form.Control
                  type="date"
                  id="start_date"
                  name="start_date"
                  defaultValue={
                    list?.start_date || format(new Date(), "yyyy-MM-dd")
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label for="due_date">Due Date</Form.Label>
                <Form.Control
                  type="date"
                  id="due_date"
                  name="due_date"
                  defaultValue={list?.due_date}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label for="completed_date">Completed Date</Form.Label>
                <Form.Control
                  type="date"
                  id="completed_date"
                  name="completed_date"
                  defaultValue={list?.completed_date}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={onDelete}>Delete</Button>{"  "}
        <Button variant="success" onClick={onSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
