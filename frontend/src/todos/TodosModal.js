import React, { useRef, useState } from "react";
import {
  Button, Col, Form,
  FormGroup,
  Input,
  Label, Modal, ModalBody,
  ModalFooter, ModalHeader, Row
} from "reactstrap";
import { updateType, createType, deleteType } from "../api/api";
import { DATA_TYPES } from "../App";
import { format } from "date-fns";

export const TodosModal = ({
  lists,
  refreshTodos,
  setTodo,
  todo,
}) => {
  const formRef = useRef()

  const [effort, setEffort] = useState(todo?.effort || 0.5)

  const onSubmit = () => {
    const id = todo?.id

    /* We have to do '|| null', to make the frontend from send 'null' instead of the blank string ''.*/
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
    }

    const operation = id ?
      updateType({ id, ...todoData }, DATA_TYPES.TODOS) : // Existing todo
      createType(todoData, DATA_TYPES.TODOS) // New todo

    operation.then(() => {
      refreshTodos()
      setTodo(null)
    }).catch(alert)
  }

  const onDelete = () => window.confirm(`Delete '${todo.title}?'`) && deleteType(todo, DATA_TYPES.TODOS).then(() => {
    refreshTodos()
    setTodo(null)
  })

  return (
    <Modal isOpen toggle={() => setTodo(null)} className="modal-lg">
      <ModalHeader>/{DATA_TYPES.TODOS.apiName}/{todo?.id || '<New Todo>'}</ModalHeader>
      <ModalBody>
        <Form id={'form'} innerRef={formRef}>
          <Row form>
            <Col md={8}>
              <FormGroup>
                <Label for="title">Title</Label>
                <Input type="text" id="title" name="title" defaultValue={todo?.title} placeholder="Title" required />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for={'list'}>List</Label>
                <Input type='select' name='list' defaultValue={todo?.list}>
                  {lists.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="effort">Effort (hrs) - {effort * 60} minutes</Label>
                <Input type="integer" name="effort" value={effort} onChange={e => setEffort(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="reward">Reward ($) - recommended ${effort}</Label>
                <Input type="integer" name="reward" defaultValue={todo?.reward || 0.5} />
              </FormGroup>
            </Col>

          </Row>

          <Row form>
            <Col md={6}><FormGroup>
              <Label for="frequency">Frequency</Label>
              <Input type="select" name="frequency" defaultValue={todo?.frequency}>
                <option value={''}>One-time</option>
                <option value={'DAILY'}>Daily</option>
                <option value={'WEEKLY'}>Weekly</option>
                <option value={'MONTHLY'}>Monthly</option>
                <option value={'QUATERLY'}>Quarterly</option>
                <option value={'YEARLY'}>Yearly</option>
              </Input>
            </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup>
                <Label for="end_date">End Date</Label>
                <Input type="date" name="end_date" defaultValue={todo?.end_date} />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label for="description">Description</Label>
            <Input type="textarea" id="description" name="description" defaultValue={todo?.description} placeholder="Description" />
          </FormGroup>

          <Row form>
            <Col md={4}>
              <FormGroup>
                <Label for="start_date">Start Date</Label>
                <Input type="date" id="start_date" name="start_date" defaultValue={todo?.start_date || format(new Date(), 'yyyy-MM-dd')} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="due_date">Due Date</Label>
                <Input type="date" id="due_date" name="due_date" defaultValue={todo?.due_date} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="completed_date">Completed Date</Label>
                <Input type="date" id="completed_date" name="completed_date" defaultValue={todo?.completed_date} />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onDelete}>Delete</Button>
        <Button color="primary" onClick={onSubmit}>Save</Button>
      </ModalFooter>
    </Modal >
  );
}