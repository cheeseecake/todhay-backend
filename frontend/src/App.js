import React, { useEffect, useState } from 'react';
import { FaPiggyBank } from 'react-icons/fa';
import {
  Button, Nav, Navbar, NavbarText, NavLink
} from 'reactstrap';
import Cards from './components/Cards';
import DateTime from './components/DateTime';
import Modal from './components/Modal';
import Table from './components/Table';

export const App = () => {
  const [activeItemType, setActiveItemType] = useState('todos');
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState({ 'title': '' });

  const [projects, setProjects] = useState([]);
  const [habits, setHabits] = useState([]);
  const [todos, setTodos] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [claimedRewards, setClaimedRewards] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);

  const refreshList = () => {
    fetch('/api/projects/')
      .then(res => res.json())
      .then(data => setProjects(data))
    fetch('/api/habits/')
      .then(res => res.json())
      .then(data => setHabits(data))
    fetch('/api/todos/')
      .then(res => res.json())
      .then(data => setTodos(data))
    fetch('/api/wishlist/')
      .then(res => res.json())
      .then(data => setWishlist(data))
  };

  useEffect(() => {
    refreshList();
  }, []);

  useEffect(() => {
    setTotalRewards(todos.filter(todo => !!todo.completedate)
      .reduce((acc, todo) => acc + parseFloat(todo.reward), 0).toFixed(2))

    setClaimedRewards(wishlist.filter(wish => !!wish.purchasedate)
      .reduce((accumulator, wish) => accumulator + parseFloat(wish.cost * wish.count), 0).toFixed(2))
  }, [todos, wishlist]);

  const toggle = () => setModal(!modal);

  const createItem = (item, type, view) => {
    let modalState = true;
    let newItem = { title: '' };
    if (!type) { type = activeItemType; }
    if (item.id) { newItem = { project: item.id, title: '' }; }
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
    switch (action) {
      case 'complete':
        activeItem = { ...item, 'completedate': new Date().toLocaleDateString('fr-CA') };
        break;
      default:
        activeItem = { ...item };
    }
    if (item.id) {
      fetch(`/api/${activeItemType}/${activeItem.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify(activeItem)
      })
      return;
    }
    fetch(`/api/${activeItemType}/`, {
      method: 'POST',
      headers: { 'Content-Type': "application/json" },
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
      <Navbar style={{ backgroundColor: '#2D3047' }} expand='md' bg='dark' variant='light'>
        <Nav className='mr-auto' tabs>
          <NavLink className={(activeItemType === 'todos') ? 'active' : ''} style={{ color: 'white', backgroundColor: '#2D3047' }} onClick={() => setActiveItemType('todos')}>Todos</NavLink>
          <NavLink className={(activeItemType === 'projects') ? 'active' : ''} style={{ color: 'white', backgroundColor: '#2D3047' }} onClick={() => setActiveItemType('projects')}>Projects</NavLink>
          <NavLink className={(activeItemType === 'habits') ? 'active' : ''} style={{ color: 'white', backgroundColor: '#2D3047' }} onClick={() => setActiveItemType('habits')}>Habits</NavLink>
          <NavLink className={(activeItemType === 'wishlist') ? 'active' : ''} style={{ color: 'white', backgroundColor: '#2D3047' }} onClick={() => setActiveItemType('wishlist')}>Wishlist</NavLink>
        </Nav>
        <NavbarText style={{ color: 'white' }} className='d-flex justify-content-center'>
          <DateTime />
        </NavbarText>
      </Navbar>
      <Navbar style={{ backgroundColor: '#2D3047' }} expand='md' bg='dark' variant='light'>
        <NavbarText style={{ color: 'white' }} className='mr-auto d-flex justify-content-center'>
          <FaPiggyBank /> Available: ${(totalRewards - claimedRewards)}
        </NavbarText>
        <NavbarText style={{ color: 'white' }} className='ml-auto d-flex justify-content-center'>
          Redeemed: ${claimedRewards} / ${totalRewards}
        </NavbarText>
      </Navbar>
      <div style={{ padding: '20px 100px 20px' }}>
        {activeItemType !== 'todos' &&
          <Button color='info' onClick={() => createItem({}, '', '')}>Add {activeItemType}</Button>}
        {activeItemType === 'todos' &&
          <Table
            todoData={todos}
            projectData={projects}
            activeItem={activeItem}
            onEdit={editItem}
            onCreate={createItem}
            handleSave={handleSave}
          />}
        {activeItemType === 'projects' &&
          <Cards
            data={projects}
            activeItemType={activeItemType}
            onEdit={editItem}
            onCreate={createItem}
          />}
        {activeItemType === 'habits' &&
          <Cards
            data={habits}
            activeItemType={activeItemType}
            onEdit={editItem}
            onCreate={createItem}
          />}
        {activeItemType === 'wishlist' &&
          <Cards
            data={wishlist}
            activeItemType={activeItemType}
            availRewards={(totalRewards - claimedRewards)}
            onEdit={editItem}
            onSave={handleSave}
          />}
        {modal ? (
          <Modal
            activeItem={activeItem}
            setActiveItem={setActiveItem}
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