import React, { Component } from "react";
// import M from 'materialize-css';
import Modal from "./components/Modal";
import Table from "./components/Table";
import Cards from "./components/Cards";
import {
  Navbar,
  Nav,
  NavLink,
  NavbarText,
  Button
} from 'reactstrap';
import axios from "axios";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      today: new Date().toLocaleString('default', { weekday: "long", day: "numeric", month: 'short', year: "numeric" }),
      activeItemType: "todos",
      projectList: [],
      todoList: [],
      habitList: [],
      wishList: [],
      modal: false,
      totalRewards: 0, 
      availRewards: 0,
      claimedRewards: 0,
      activeItem: {
        title: ""
      },
    };
  }
  componentDidMount() {
    this.refreshList();
    this.refreshRewards();

  }
  refreshList = async () => {
    await axios
      .get("/api/todos/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err));
    await axios
      .get("/api/projects/")
      .then((res) => this.setState({ projectList: res.data }))
      .catch((err) => console.log(err));
    await axios
      .get("/api/habits/")
      .then((res) => this.setState({ habitList: res.data }))
      .catch((err) => console.log(err));
    await axios
      .get("/api/wishlist/")
      .then((res) => this.setState({ wishList: res.data }))
      .catch((err) => console.log(err));
    this.refreshRewards();
  };

  refreshRewards = () => {
    const { wishList, todoList} = this.state;
    let claimedRewards, totalRewards, availRewards;
    var completedTodoList = todoList.filter((todo) => todo.completedate !== null)
    totalRewards = completedTodoList.reduce((accumulator, todo) => accumulator + parseFloat(todo.reward), 0).toFixed(2)
    var claimedWishList = wishList.filter((wish) => wish.purchasedate !== null)
    claimedRewards = claimedWishList.reduce((accumulator, wish) => accumulator + parseFloat(wish.cost*wish.count), 0).toFixed(2)
    availRewards = (totalRewards - claimedRewards)
    this.setState({
      totalRewards,
      claimedRewards,
      availRewards
    })
  }
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  createItem = (item, type) => {
    if (!type) {
      type = this.state.activeItemType;
    }
    if (item.id) {
      const newItem = { project: item.id, title: ""};
      this.setState({ activeItem: newItem, modal: !this.state.modal, activeItemType: type});
      return
    }
    const newItem = { title: "" };
    this.setState({ activeItem: newItem, modal: !this.state.modal, activeItemType: type});
  };

  editItem = (item, type) => {
    const { todoList} = this.state;
    if(type === "journal") {
      item = todoList.filter((todo) => todo.title ===  "Journal" && todo.completedate === null)[0];
      type = 'todos';
    }
    this.setState({ activeItem: item, modal: !this.state.modal, activeItemType: type});
  };


handleSubmit = async (item, action) => {
  this.setState({ modal: false});
  console.log(item)
  let activeItem;
  switch(action) {
  case "complete":
    activeItem = { ...item, 'completedate': new Date().toLocaleDateString("fr-CA")};
    break;
  default:
    activeItem = { ...item};
  }
  if (item.id) {
    await axios
      .put(`/api/${this.state.activeItemType}/${activeItem.id}/`, activeItem)
      .then((res) => this.refreshList());
    return;
  }
  await axios
    .post(`/api/${this.state.activeItemType}/`, activeItem)
    .then((res) => this.refreshList());
};

handleJournal = (item) => {
  this.setState({ modal: false});
  console.log(item)
  let activeItem, otherItems;
  
  otherItems = item['otherItems']
  console.log(otherItems)
  delete item['otherItems']
  activeItem = { ...item};
  this.handleSubmit(activeItem, 'complete')
  for (const i in otherItems) {
    this.handleSubmit(otherItems[i], 'complete')
  }
}
handleDelete = (item) => {
  this.setState({ modal: false});
  axios
    .delete(`/api/${this.state.activeItemType}/${item.id}/`)
    .then((res) => this.refreshList());
};

  render() {
    return (
      <div>
      <Navbar style={{backgroundColor: '#2D3047'}}  expand="md"  bg="dark" variant="light">
            <Nav className="mr-auto" tabs>
                <NavLink className={(this.state.activeItemType === 'todos') ? "active" : ""} style={{color: 'white', backgroundColor: '#2D3047'}} onClick={() => this.setState({ activeItemType: 'todos'})}>Todos</NavLink>
                <NavLink className={(this.state.activeItemType === 'projects') ? "active" : ""} style={{color: 'white', backgroundColor: '#2D3047'}} onClick={() => this.setState({ activeItemType: 'projects'})}>Projects</NavLink>
                <NavLink className={(this.state.activeItemType === 'habits') ? "active" : ""} style={{color: 'white', backgroundColor: '#2D3047'}} onClick={() => this.setState({ activeItemType: 'habits'})}>Habits</NavLink>
                <NavLink className={(this.state.activeItemType === 'wishlist') ? "active" : ""} style={{color: 'white', backgroundColor: '#2D3047'}} onClick={() => this.setState({ activeItemType: 'wishlist'})}>Wishlist</NavLink>
              </Nav>
          <NavbarText style={{color: 'white'}} className="d-flex justify-content-center">
          {this.state.today}
          </NavbarText>
        </Navbar>
        <Navbar style={{backgroundColor: '#2D3047'}}  expand="md"  bg="dark" variant="light">
        {this.state.activeItemType ==="todos" ? (
        <Button color="info" onClick={() => this.editItem({}, 'journal')}>New journal</Button>
        ) : <Button color="info" onClick={() => this.createItem({}, '')}>Add {this.state.activeItemType}</Button>}
        &nbsp;&nbsp;&nbsp;<NavbarText style={{color: 'white'}} className="mr-auto d-flex justify-content-center">
          Available: ${this.state.availRewards}
          </NavbarText> 
          <NavbarText style={{color: 'white'}} className="ml-auto d-flex justify-content-center">
          Claimed: ${this.state.claimedRewards} / ${this.state.totalRewards}
          </NavbarText> 
        </Navbar>
        <div style={{padding: '20px 100px 20px'}}>
        
        {this.state.activeItemType === 'todos' &&  
          <Table 
          data = {this.state.todoList} 
          onEdit={this.editItem}
          onSubmit={this.handleSubmit}
          onCreate={this.createItem}
          projectData = {this.state.projectList}
          />}
        {this.state.activeItemType === 'projects' &&
        <Cards 
        data = {this.state.projectList} 
        onEdit={this.editItem}
        onCreate={this.createItem}
        activeItemType={this.state.activeItemType}
        />}
        {this.state.activeItemType === 'habits' &&
        <Cards 
        data = {this.state.habitList} 
        onEdit={this.editItem}
        activeItemType={this.state.activeItemType}
        />}
        {this.state.activeItemType === 'wishlist' &&
        <Cards 
        data = {this.state.wishList} 
        onEdit={this.editItem}
        activeItemType={this.state.activeItemType}
        availRewards = {this.state.availRewards}
        onSubmit={this.handleSubmit}
        />}        
        {this.state.modal ? (
          <Modal
            data = {this.state.todoList} 
            activeItem={this.state.activeItem}
            activeItemType={this.state.activeItemType}
            toggle={this.toggle}
            onSave={this.handleSubmit}
            onJournal={this.handleJournal}
            onDelete={this.handleDelete}
          />
        ) : null}
      </div>
      </div>
    );
  }
}

export default App;