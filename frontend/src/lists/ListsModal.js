import format from "date-fns/format";
import React, { useRef } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { createType, updateType } from "../api/api";
import { DATA_TYPES } from "../App";

export const ListsModal = ({ list, setList, tags, refreshLists }) => {
  const formRef = useRef();

  const onSubmit = () => {
    const id = list?.id;

    const listData = {
      title: formRef.current.title.value,

      /* In HTML, the options of a select element are not an array (although 'array-like'),
      and here the ... destructuring operator is used to coerce it into an array,
      so we can iterate through it */
      tags: [...formRef.current.tags.options].reduce(
        (acc, opt) => (opt.selected ? [parseInt(opt.value), ...acc] : acc),
        []
      ),
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
    <Modal isOpen toggle={() => setList(null)} className="modal-lg">
      <ModalHeader>
        /{DATA_TYPES.LISTS.apiName}/{list.id || "<New List>"}
      </ModalHeader>
      <ModalBody>
        <Form id={"form"} innerRef={formRef}>
          <Row form>
            <Col md={8}>
              <FormGroup>
                <Label for="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={list?.title}
                  placeholder="Title"
                  required
                />
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label for="tags">Tags</Label>
                <Input type="select" multiple name="tags">
                  {tags.map((tag) => (
                    /* I think I figured it out: when there are tags, and you open the modal to
                    create a new list, that list is initialized as the empty object {}, which has
                    no 'tags' property, so you need the ?. null chaining operator ONLY after 'tags'. */
                    <option
                      key={tag.id}
                      value={tag.id}
                      selected={list.tags?.includes(tag.id)}
                    >
                      {tag.title}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              id="description"
              name="description"
              defaultValue={list?.description}
              placeholder="Description"
            />
          </FormGroup>

          <Row form>
            <Col md={4}>
              <FormGroup>
                <Label for="start_date">Start Date</Label>
                <Input
                  type="date"
                  id="start_date"
                  name="start_date"
                  defaultValue={
                    list?.start_date || format(new Date(), "yyyy-MM-dd")
                  }
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="due_date">Due Date</Label>
                <Input
                  type="date"
                  id="due_date"
                  name="due_date"
                  defaultValue={list?.due_date}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="completed_date">Completed Date</Label>
                <Input
                  type="date"
                  id="completed_date"
                  name="completed_date"
                  defaultValue={list?.completed_date}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onSubmit}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};
