import { format, parseISO } from 'date-fns';
import React, { useState } from "react";
import { FcClock, FcMoneyTransfer } from "react-icons/fc";
import { Button, Card, CardBody, CardColumns, CardText, CardTitle } from 'reactstrap';
import { deleteType } from '../api/api';
import { DATA_TYPES } from '../App';
import { formatDays } from '../shared/util';
import { ListsModal } from './ListsModal';

export const Lists = ({
  lists,
  refreshLists,
  todos,
  viewTodosFromListId,
}) => {
  const [editingList, setEditingList] = useState()

  const onDelete = list => window.confirm(`Are you sure you want to delete '${list.title}'?`) &&
    deleteType(list, DATA_TYPES.LISTS).then(refreshLists)

  const cards = lists.map(list => {

    // Only count completed todos in calculating effort and earnings
    const completedTodosInList = todos.filter(todo => todo.list === list.id && !!todo.completed_date)
    const totalEffort = completedTodosInList.reduce((acc, todo) => acc + parseFloat(todo.effort), 0)
    const totalRewards = completedTodosInList.reduce((acc, todo) => acc + parseFloat(todo.reward), 0)

    return (
      <Card key={list.id} style={{ backgroundColor: '#E1F0C4', cursor: 'pointer' }} onClick={() => setEditingList(list)}>
        <CardBody >

          <CardTitle tag="h5">
            {list.title}
          </CardTitle>

          <CardText>{list.due_date ? `Due ${formatDays(list.due_date)} (${format(parseISO(list.due_date), 'd MMM')})` : 'No due date'}</CardText>
          <CardText><FcMoneyTransfer /> Earned ${totalRewards}</CardText>
          <CardText><FcClock /> Invested {totalEffort} hrs</CardText>

          <div style={{ display: 'flex', justifyContent: 'space-around' }}>

            <Button
              color="primary"
              onClick={e => {
                e.stopPropagation()
                viewTodosFromListId(list.id)
              }}>
              View/Add todos
            </Button>

            <Button
              onClick={e => {
                e.stopPropagation()
                onDelete(list)
              }}>
              Delete
            </Button>

          </div>

        </CardBody>
      </Card>
    )
  })

  return (<>
    <Button
      color='info'
      onClick={() => setEditingList({})}>Add list</Button>
    <div style={{ padding: '20px' }}>

      {editingList && <ListsModal
        list={editingList}
        setList={setEditingList}
        refreshLists={refreshLists} />}
      <CardColumns style={{ columnCount: '4' }}>
        {cards}
      </CardColumns>

    </div>
  </>
  )
}