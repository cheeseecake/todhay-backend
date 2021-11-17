import React, { useState, useEffect } from 'react';
// import M from 'materialize-css';
import Modal from './components/Modal';
import Table from './components/Table';
import Cards from './components/Cards';
import DateTime from './components/DateTime';
import { FaPiggyBank } from 'react-icons/fa';
import {
  Navbar,
  Nav,
  NavLink,
  NavbarText,
  Button
} from 'reactstrap';

function App (){
  // State
  const [activeItemType, setActiveItemType] = useState('todos');
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState({'title':''});

  const [projectList, setprojectList] = useState([]);
  const [habitList, sethabitList] = useState([]);
  const [todoList, settodoList] = useState([]);
  const [wishList, setwishList] = useState([]);
 
  const [claimedRewards, setclaimedRewards] = useState(0);
  const [totalRewards, settotalRewards] = useState(0);

  const refreshList = () => {
    fetch('/api/projects/', {method:'GET'})
      .then(res => res.json())
      .then(data => setprojectList(data))
      .catch(err => console.log(err));
    fetch('/api/habits/', {method:'GET'})
      .then(res => res.json())
      .then(data => sethabitList(data))
      .catch(err => console.log(err));
    fetch('/api/todos/', {method:'GET'})
      .then(res => res.json())
      .then(data => settodoList(data))
      .catch(err => console.log(err));
    fetch('/api/wishlist/', {method:'GET'})
      .then(res => res.json())
      .then(data => setwishList(data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    refreshList();
    }, []);
  
  useEffect(() => {
    var completedTodoList = todoList.filter((todo) => todo.completedate !== null)
    settotalRewards(completedTodoList.reduce((accumulator, todo) => accumulator + parseFloat(todo.reward), 0).toFixed(2))
    var claimedWishList = wishList.filter((wish) => wish.purchasedate !== null)
    setclaimedRewards(claimedWishList.reduce((accumulator, wish) => accumulator + parseFloat(wish.cost*wish.count), 0).toFixed(2))
      }, [todoList, wishList]);

  // Action: code that causes an update to the state when something happens
  const toggle = () => {
    setModal(!modal);
    refreshList();
  };

  const createItem = (item, type, view) => {
    let modalState = true;
    let newItem = { title: '' };
    if (!type) {type = activeItemType;}
    if (item.id) { newItem = { project: item.id, title: ''};}
    if (view) {
      modalState = false;
      newItem = { view: view, title: item.title };
    }  
    setActiveItem(newItem);
    setModal(modalState);
    setActiveItemType(type)
  };

 const editItem = (item, type) => {
    setActiveItem(item);
    setModal(!modal);
    setActiveItemType(type)
  };
  
 const handleSave = (item, activeItemType, action) => {
  setModal(!modal);
  let activeItem;
  switch(action) {
  case 'complete':
    activeItem = { ...item, 'completedate': new Date().toLocaleDateString('fr-CA')};
    break;
  default:
    activeItem = { ...item};
  }
  if (item.id) {
    fetch(`/api/${activeItemType}/${activeItem.id}/`, {
      method: 'PUT',
      headers: {'Content-Type': "application/json"},
      body: JSON.stringify(activeItem)
    })
    return;
  }
  fetch(`/api/${activeItemType}/`, {
    method: 'POST',
    headers: {'Content-Type': "application/json"},
    body: JSON.stringify(activeItem)
  })
};
  
const handleDelete = (item, activeItemType) => {
    setModal(false);
    fetch(`/api/${activeItemType}/${item.id}/`, {
      method: 'DELETE'
    })
  }
  
// View: the UI definition
return (
      <div>
      <Navbar style={{backgroundColor: '#2D3047'}}  expand='md'  bg='dark' variant='light'>
            <Nav className='mr-auto' tabs>
                <NavLink className={(activeItemType === 'todos') ? 'active' : ''} style={{color: 'white', backgroundColor: '#2D3047'}} onClick={() => setActiveItemType('todos')}>Todos</NavLink>
                <NavLink className={(activeItemType === 'projects') ? 'active' : ''} style={{color: 'white', backgroundColor: '#2D3047'}} onClick={() => setActiveItemType('projects')}>Projects</NavLink>
                <NavLink className={(activeItemType === 'habits') ? 'active' : ''} style={{color: 'white', backgroundColor: '#2D3047'}} onClick={() => setActiveItemType('habits')}>Habits</NavLink>
                <NavLink className={(activeItemType === 'wishlist') ? 'active' : ''} style={{color: 'white', backgroundColor: '#2D3047'}} onClick={() => setActiveItemType('wishlist')}>Wishlist</NavLink>
              </Nav>
          <NavbarText style={{color: 'white'}} className='d-flex justify-content-center'>
            <DateTime/>
          </NavbarText>
        </Navbar>
        <Navbar style={{backgroundColor: '#2D3047'}}  expand='md'  bg='dark' variant='light'>
          <NavbarText style={{color: 'white'}} className='mr-auto d-flex justify-content-center'>
            <FaPiggyBank/> Available: ${(totalRewards - claimedRewards)} 
          </NavbarText> 
          <NavbarText style={{color: 'white'}} className='ml-auto d-flex justify-content-center'>
            Redeemed: ${claimedRewards} / ${totalRewards}
          </NavbarText> 
        </Navbar>
        <div style={{padding: '20px 100px 20px'}}>
        {activeItemType !=='todos' && 
        <Button color='info' onClick={() => createItem({}, '', '')}>Add {activeItemType}</Button>}
        {activeItemType === 'todos' &&  
          <Table 
          todoData = {todoList} 
          projectData = {projectList}
          activeItem = {activeItem}
          onEdit={editItem}
          onCreate={createItem}
          />}
        {activeItemType === 'projects' &&
          <Cards 
          data = {projectList} 
          activeItemType={activeItemType}
          onEdit={editItem}
          onCreate={createItem}
          />}
        {activeItemType === 'habits' &&
          <Cards 
          data = {habitList} 
          activeItemType={activeItemType}
          onEdit={editItem}
          onCreate={createItem}
          />}
        {activeItemType === 'wishlist' &&
          <Cards 
          data = {wishList} 
          activeItemType={activeItemType}
          availRewards = {(totalRewards - claimedRewards)}
          onEdit={editItem}
          onSave={handleSave}
          />}        
        {modal ? (
          <Modal
            activeItem={activeItem}
            activeItemType={activeItemType}
            toggle={toggle}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ) : null}
      </div>
      </div>
    );
}

export default App;