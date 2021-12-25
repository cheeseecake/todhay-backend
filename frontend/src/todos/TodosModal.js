import React, { useRef, useState } from "react";
import { Button, Row, Col, Form, Modal } from "react-bootstrap";
import { updateType, createType, deleteType } from "../api/api";
import { DATA_TYPES } from "../App";
import { format } from "date-fns";

export const TodosModal = ({ lists, refreshTodos, setTodo, todo }) => {
  const formRef = useRef();

  const [effort, setEffort] = useState(todo?.effort || 0.5);

  const onSubmit = () => {
    const id = todo?.id;

    /* We have to do '|| null', to make the frontend send 'null' instead of the blank string ''.*/
    const todoData = {
      completed_date: formRef.current.completed_date.value || null,
      description: formRef.current.description.value,
      due_date: formRef.current.due_date.value || null,
      effort, // This value is read from useState instead since it's used to calculate the suggestions
      end_date: formRef.current.end_date.value || null,
      frequency: formRef.current.frequency.value || null,
      list: formRef.current.list.value,
      reward: formRef.current.reward.value,
      start_date: formRef.current.start_date.value || null,
      title: formRef.current.title.value,
    };

    const operation = id
      ? updateType({ id, ...todoData }, DATA_TYPES.TODOS) // Existing todo
      : createType(todoData, DATA_TYPES.TODOS); // New todo

    operation
      .then(() => {
        refreshTodos();
        setTodo(null);
      })
      .catch(alert);
  };

  const onDelete = () =>
    window.confirm(`Delete '${todo.title}?'`) &&
    deleteType(todo, DATA_TYPES.TODOS).then(() => {
      refreshTodos();
      setTodo(null);
    });

  return (
    <Modal show onHide={() => setTodo(null)} size="lg" backdrop="static">
      <Modal.Header closeButton>
        /{DATA_TYPES.TODOS.apiName}/{todo?.id || "<New Todo>"}
      </Modal.Header>
      <Modal.Body>
        <Form id={"form"} ref={formRef}>
          <Row form>
            <Col md={8}>
              <Form.Group>
                <Form.Label for="title">Title</Form.Label>
                <Form.Control
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={todo?.title}
                  placeholder="Title"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label for={"list"}>List</Form.Label>
                <Form.Select name="list" defaultValue={todo?.list}>
                  {lists.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
                    </option>
                  ))}
                </Form.Select >
              </Form.Group>
            </Col>
          </Row>

          <Row form>
            <Col md={6}>
              <Form.Group>
                <Form.Label for="effort">Effort (hrs) - {effort * 60} minutes</Form.Label>
                <Form.Control
                  type="integer"
                  name="effort"
                  value={effort}
                  onChange={(e) => setEffort(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label for="reward">Reward ($) - recommended ${effort}</Form.Label>
                <Form.Control
                  type="integer"
                  name="reward"
                  defaultValue={todo?.reward || 0.5}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row form>
            <Col md={6}>
              <Form.Group>
                <Form.Label for="frequency">Frequency</Form.Label>
                <Form.Select
                  name="frequency"
                  defaultValue={todo?.frequency}
                >
                  <option value={""}>One-time</option>
                  <option value={"DAILY"}>Daily</option>
                  <option value={"WEEKLY"}>Weekly</option>
                  <option value={"MONTHLY"}>Monthly</option>
                  <option value={"QUATERLY"}>Quarterly</option>
                  <option value={"YEARLY"}>Yearly</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label for="end_date">End Date</Form.Label>
                <Form.Control
                  type="date"
                  name="end_date"
                  defaultValue={todo?.end_date}
                />
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
                defaultValue={todo?.description}
                placeholder="Description"
              />
            </Form.Group>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label for="start_date">Start Date</Form.Label>
                <Form.Control
                  type="date"
                  id="start_date"
                  name="start_date"
                  defaultValue={
                    todo?.start_date || format(new Date(), "yyyy-MM-dd")
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
                  defaultValue={todo?.due_date}
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
                  defaultValue={todo?.completed_date}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={onDelete}>Delete</Button>{' '}
        <Button variant="success" onClick={onSubmit}>Save</Button>{' '}
      </Modal.Footer>
    </Modal>
  );
};
