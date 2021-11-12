import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : this.props.data,
      activeItem: this.props.activeItem,
      activeItemType: this.props.activeItemType,
    };
  };
  handleChange = (e) => {
    let { name, value } = e.target;
    const activeItem = { ...this.state.activeItem, [name]: value };
    this.setState({ activeItem });
    console.log(activeItem)
  };
  render() {
    const { toggle, onSave, onDelete } = this.props;
    const { activeItemType, activeItem} = this.props;
    console.log(activeItem)
    return (
      <Modal isOpen={true} toggle={toggle} className="modal-lg">
        <ModalHeader toggle={toggle}>/{activeItem.project}/{activeItemType}/</ModalHeader>
        <ModalBody>
          <Form>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input type="text" id="title" name="title" value={this.state.activeItem.title}
              onChange={this.handleChange} placeholder="Title" maxLength="40"/>
          </FormGroup>
          {activeItemType==="wishlist" && 
          <Row form>
              <Col md={4}><FormGroup>
                <Label for="cost">Cost ($)</Label>
                <Input type="integer" id="cost" name="cost" value={this.state.activeItem.cost}
                  onChange={this.handleChange}/>
              </FormGroup></Col>
              <Col md={4}><FormGroup>
              <Label for="type">Repeat?</Label>
              <Input
                type="select"
                id="repeat"
                name="repeat"
                value={this.state.activeItem.repeat}
                onChange={this.handleChange}
              >
              <option >false</option>
              <option >true</option>
            </Input>
              </FormGroup></Col>
              <Col md={12}><FormGroup>
                <Label for="imgurl">Image URL</Label>
                <Input type="text" id="imgurl" name="imgurl" value={this.state.activeItem.imgurl}
                  onChange={this.handleChange}  maxLength="400"/>
              </FormGroup></Col>
              <Col md={12}><FormGroup>
                <Label for="producturl">Product URL</Label>
                <Input type="text" id="producturl" name="producturl" value={this.state.activeItem.producturl}
                  onChange={this.handleChange}  maxLength="400"/>
              </FormGroup></Col>
              </Row>}
            <Row form>
            {['habits', 'todos'].includes(activeItemType) && 
              <Col md={4}><FormGroup>
                <Label for="effort">Effort (hrs) - {this.state.activeItem.effort*60} minutes</Label>
                <Input type="integer" id="effort" name="effort" value={this.state.activeItem.effort}
                  onChange={this.handleChange} placeholder="0.5" />
              </FormGroup></Col>}
              {['habits', 'todos'].includes(activeItemType) && 
              <Col md={4}><FormGroup>
              <Label for="reward">Reward ($) - recommended ${this.state.activeItem.effort*1}</Label>
              <Input type="integer" id="reward" name="reward" value={this.state.activeItem.reward}
                onChange={this.handleChange} placeholder="0.5" />
            </FormGroup></Col>}     
            {activeItemType==="habits" && 
              <Col md={4}><FormGroup>
              <Label for="enddate">End Date</Label>
              <Input type="date" id="enddate" name="enddate" value={this.state.activeItem.enddate}
                onChange={this.handleChange}/>
              </FormGroup></Col>}
            {activeItemType==="projects" &&        
              <Col md={12}><FormGroup>
              <Label for="type">Type</Label>
              <Input
                type="select"
                id="type"
                name="type"
                value={this.state.activeItem.type}
                onChange={this.handleChange}
              >
              <option >Personal</option>
              <option >Work</option>
              </Input>
            </FormGroup></Col>}
          </Row>
          {activeItemType==="habits" &&   
          <Row form>
              <Col md={6}><FormGroup>
              <Label for="frequency">Frequency</Label>
              <Input type="select" id="frequency" name="frequency" value={this.state.activeItem.frequency} 
              onChange={this.handleChange}>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
              </Input>
            </FormGroup></Col>
            <Col md={6}><FormGroup>
              <Label for="category">Category</Label>
              <Input type="select" id="category" name="category" value={this.state.activeItem.category} 
              onChange={this.handleChange}>
              <option>Learning</option>
              <option>Financial</option>
              <option>Health</option>
              <option>Social</option>
              </Input>
            </FormGroup></Col>
            </Row>}
            {activeItemType!=="wishlist" && 
            <FormGroup>
            <Label for="description">Description</Label>
            <Input style={{height:'200px'
            }} type="textarea" id="description" name="description" value={this.state.activeItem.description}
              onChange={this.handleChange} placeholder="Description"/>
          </FormGroup>}
          {['projects', 'todos'].includes(activeItemType) &&       
          <Row form>
              <Col md={4}><FormGroup>
              <Label for="startdate">Start Date</Label>
              <Input type="date" id="startdate" name="startdate" value={this.state.activeItem.startdate}
              onChange={this.handleChange}/>
            </FormGroup></Col>
              <Col md={4}><FormGroup>
              <Label for="duedate">Due Date</Label>
              <Input type="date" id="duedate" name="duedate" value={this.state.activeItem.duedate}
                onChange={this.handleChange}/>
              </FormGroup></Col>
              <Col md={4}><FormGroup>
              <Label for="completedate">Complete Date</Label>
              <Input type="date" id="completedate" name="completedate" value={this.state.activeItem.completedate}
              onChange={this.handleChange}/>
            </FormGroup></Col>
            </Row>}
          </Form>
        </ModalBody>
        <ModalFooter>
        <Button onClick={() => onDelete(this.state.activeItem)}>Delete</Button> &nbsp;
        <Button color="primary" onClick={() => onSave(this.state.activeItem,'update')}>Save</Button> &nbsp;
        </ModalFooter>
      </Modal>
    );
  }
}