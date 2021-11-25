import { formatDuration, intervalToDuration, formatDistanceToNow, parseJSON, parseISO } from "date-fns";
import format from "date-fns/format";
import React, { useEffect, useState } from "react";
import { Button, Input, Nav, Navbar, NavLink } from 'reactstrap';
import { patchType } from "../api/api";
import { DATA_TYPES } from "../App";
import { formatDays } from "../shared/util";
import { TodosModal } from "./TodosModal";

export const Todos = ({
    lists,
    refreshTodos,
    selectedListId,
    setSelectedListId,
    todos,
}) => {

    const [editingTodo, setEditingTodo] = useState()

    // Whether to show only completed todos
    // Note: This also determines whether the 'Completed' tab is 
    // the active tab or not
    const [showCompleted, setShowCompleted] = useState(false);

    /* Always refetch todos when this view is first mounted */
    useEffect(() => refreshTodos(), [refreshTodos])

    const completeTodo = todo => patchType({...todo, completed_date: format(new Date(), 'yyyy-MM-dd') }, DATA_TYPES.TODOS).then(refreshTodos)

    // Filter todos by list if a list was selected from dropdown,
    // or if no list was selected show everything
    let filteredTodos = selectedListId ?
        todos
            .filter(todo => todo.list === selectedListId)
            .filter(todo => !!todo.completed_date === showCompleted) :
        todos

    // Further filter depending on showCompleted
    // '!!' coerces the operand to a boolean value
    filteredTodos = filteredTodos.filter(todo => !!todo.completed_date === showCompleted)

    return (<>
        {editingTodo && <TodosModal
            lists={lists}
            refreshTodos={refreshTodos}
            setTodo={setEditingTodo}
            todo={editingTodo}
        />}
        <div>
            <Navbar expand="md" bg="dark" variant="light">
                <Nav className="mr-auto" tabs>
                    <NavLink>
                        <Input
                            type="select"
                            name="select"
                            value={lists.find(list => list.id === selectedListId)?.id}
                            onChange={e => setSelectedListId(e.target.value)}>
                            <option value={''}>All</option>
                            {lists.map(list =>
                                <option key={list.id} value={list.id}>
                                    {list.title}
                                </option>)
                            }
                        </Input>
                    </NavLink>
                    <NavLink>
                        <Button color='info' onClick={() => setEditingTodo({ list: selectedListId })}>Add todo</Button>
                    </NavLink>
                </Nav>
                <Nav className="ml-auto" tabs>
                    <NavLink className={!showCompleted ? "active" : ""} onClick={() => setShowCompleted(false)}>In Progress/ Backlog</NavLink>
                    <NavLink className={showCompleted ? "active" : ""} onClick={() => setShowCompleted(true)}>Completed</NavLink>
                </Nav>
            </Navbar>

            <div className="table-responsive">
                <table className="table table-bordered table-hover dataTables-example" >
                    <thead style={{ backgroundColor: '#2D3047', color: 'white' }}>
                        <tr>
                            <th>Title ({filteredTodos.length})</th>
                            <th>Effort ({filteredTodos.reduce((acc, todo) => acc + parseFloat(todo.effort), 0)} hrs)</th>
                            <th>Rewards (${filteredTodos.reduce((acc, todo) => acc + parseFloat(todo.reward), 0)})</th>
                            <th>Start Date</th>
                            <th>Due Date</th>
                            <th>Completed Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTodos.map(todo => {
                            // https://stackoverflow.com/questions/62590455/format-time-interval-in-seconds-as-x-hours-y-minutes-z-seconds
                            const formattedEffortHours = formatDuration(intervalToDuration({ start: 0, end: todo.effort * 3600_000 }))
                            const formattedStartDate = formatDays(todo.start_date)
                            const formattedDueDate = todo.due_date ? formatDays(todo.due_date) : ''
                            const isOverdue = new Date() > parseISO(todo.due_date)

                            return <tr key={todo.id} style={{ backgroundColor: todo.days_to_start <= 1 ? '#E8EBF7' : 'white' }}>
                                <td onClick={() => setEditingTodo(todo)} >{todo.title}
                                    <br />
                                    <span style={{ fontSize: '80%', color: '#597AB1', fontWeight: 'bold', fontStyle: 'italic' }}>
                                        {todo.list.title}
                                    </span>
                                </td>

                                <td>{formattedEffortHours}</td>
                                <td>${todo.reward}</td>
                                <td>{todo.start_date} <br /><b style={{ fontSize: '80%' }}>{formattedStartDate}</b></td>
                                <td>{todo.due_date || 'None'} <br /><b style={{ fontSize: '80%', color: isOverdue ? "#D33F49" : 'black' }}>{formattedDueDate}</b></td>
                                <td>
                                    {todo.completed_date ||
                                        <Button
                                            color="success"
                                            onClick={() => completeTodo(todo)}>
                                            Complete
                                        </Button>}
                                </td>
                            </tr>
                        })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </>
    )
}