import React from "react";
import {
  Button, Col, Form,
  FormGroup,
  Input,
  Label, Modal, ModalBody,
  ModalFooter, ModalHeader, Row
} from "reactstrap";


function CustomModal({
  activeItem,
  activeItemType,
  onDelete,
  onSave,
  setActiveItem,
  toggle,
}) {

  const handleChange = (e) => {
    let { name, value } = e.target;
    setActiveItem({ ...activeItem, [name]: value });
    console.log(activeItem)
  };

  return (
    <Modal isOpen={true} toggle={toggle} className="modal-lg">
      <ModalHeader toggle={toggle}>/{activeItem.project}/{activeItemType}/</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input type="text" id="title" name="title" value={activeItem.title}
              onChange={handleChange} placeholder="Title" maxLength="40" />
          </FormGroup>
          {activeItemType === "wishlist" &&
            <Row form>
              <Col md={4}><FormGroup>
                <Label for="cost">Cost ($)</Label>
                <Input type="integer" id="cost" name="cost" value={activeItem.cost}
                  onChange={handleChange} />
              </FormGroup></Col>
              <Col md={4}><FormGroup>
                <Label for="type">Repeat?</Label>
                <Input
                  type="select"
                  id="repeat"
                  name="repeat"
                  value={activeItem.repeat}
                  onChange={handleChange}
                >
                  <option >false</option>
                  <option >true</option>
                </Input>
              </FormGroup></Col>
              <Col md={12}><FormGroup>
                <Label for="imgurl">Image URL</Label>
                <Input type="text" id="imgurl" name="imgurl" value={activeItem.imgurl}
                  onChange={handleChange} maxLength="400" />
              </FormGroup></Col>
              <Col md={12}><FormGroup>
                <Label for="producturl">Product URL</Label>
                <Input type="text" id="producturl" name="producturl" value={activeItem.producturl}
                  onChange={handleChange} maxLength="400" />
              </FormGroup></Col>
            </Row>}
          <Row form>
            {['habits', 'todos'].includes(activeItemType) &&
              <Col md={4}><FormGroup>
                <Label for="effort">Effort (hrs) - {activeItem.effort * 60} minutes</Label>
                <Input type="integer" id="effort" name="effort" value={activeItem.effort}
                  onChange={handleChange} placeholder="0.5" />
              </FormGroup></Col>}
            {['habits', 'todos'].includes(activeItemType) &&
              <Col md={4}><FormGroup>
                <Label for="reward">Reward ($) - recommended ${activeItem.effort * 1}</Label>
                <Input type="integer" id="reward" name="reward" value={activeItem.reward}
                  onChange={handleChange} placeholder="0.5" />
              </FormGroup></Col>}
            {activeItemType === "habits" &&
              <Col md={4}><FormGroup>
                <Label for="enddate">End Date</Label>
                <Input type="date" id="enddate" name="enddate" value={activeItem.enddate}
                  onChange={handleChange} />
              </FormGroup></Col>}
            {activeItemType === "projects" &&
              <Col md={12}><FormGroup>
                <Label for="type">Type</Label>
                <Input
                  type="select"
                  id="type"
                  name="type"
                  value={activeItem.type}
                  onChange={handleChange}
                >
                  <option >Personal</option>
                  <option >Work</option>
                </Input>
              </FormGroup></Col>}
          </Row>
          {activeItemType === "habits" &&
            <Row form>
              <Col md={6}><FormGroup>
                <Label for="frequency">Frequency</Label>
                <Input type="select" id="frequency" name="frequency" value={activeItem.frequency}
                  onChange={handleChange}>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </Input>
              </FormGroup></Col>
              <Col md={6}><FormGroup>
                <Label for="category">Category</Label>
                <Input type="select" id="category" name="category" value={activeItem.category}
                  onChange={handleChange}>
                  <option>Learning</option>
                  <option>Financial</option>
                  <option>Health</option>
                  <option>Social</option>
                </Input>
              </FormGroup></Col>
            </Row>}
          {activeItemType !== "wishlist" &&
            <FormGroup>
              <Label for="description">Description</Label>
              <Input style={{
                height: '200px'
              }} type="textarea" id="description" name="description" value={activeItem.description}
                onChange={handleChange} placeholder="Description" />
            </FormGroup>}
          {['projects', 'todos'].includes(activeItemType) &&
            <Row form>
              <Col md={4}><FormGroup>
                <Label for="startdate">Start Date</Label>
                <Input type="date" id="startdate" name="startdate" value={activeItem.startdate}
                  onChange={handleChange} />
              </FormGroup></Col>
              <Col md={4}><FormGroup>
                <Label for="duedate">Due Date</Label>
                <Input type="date" id="duedate" name="duedate" value={activeItem.duedate}
                  onChange={handleChange} />
              </FormGroup></Col>
              <Col md={4}><FormGroup>
                <Label for="completedate">Complete Date</Label>
                <Input type="date" id="completedate" name="completedate" value={activeItem.completedate}
                  onChange={handleChange} />
              </FormGroup></Col>
            </Row>}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => onDelete(activeItem)}>Delete</Button> &nbsp;
        <Button color="primary" onClick={() => onSave(activeItem, activeItemType)}>Save</Button> &nbsp;
      </ModalFooter>
    </Modal>
  );
}
export default CustomModal;