import {
  formatDuration,
  intervalToDuration, parseISO
} from "date-fns";
import format from "date-fns/format";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Badge, Button, Nav, Table, Row, Col, Form } from "react-bootstrap";
import { patchType } from "../api/api";
import { DATA_TYPES } from "../App";
import { formatDays } from "../shared/util";
import { TodosModal } from "./TodosModal";

export const Todos = ({
  tags,
  lists,
  refreshTodos,
  selectedListId,
  setSelectedListId,
  todos,
}) => {
  const [editingTodo, setEditingTodo] = useState();
  const [selectedTags, setSelectedTags] = useState([]);

  const [filteredStatus, setfilteredStatus] = useState('In Progress');

  const [showHabits, setShowHabits] = useState(false);

  /* Always refetch todos when this view is first mounted */
  useEffect(() => refreshTodos(), [refreshTodos]);

  const completeTodo = (todo) =>
    patchType(
      { ...todo, completed_date: format(new Date(), "yyyy-MM-dd") },
      DATA_TYPES.TODOS
    ).then(refreshTodos);

  // Filter list selection by tag if a tag was selected from autocomplete field,
  // or if no tag was selected show everything
  let filteredLists =
    selectedTags.length > 0
      ? lists.filter((list) =>
        list.tags.some((tag) => selectedTags.includes(tag))
      )
      : lists;

  // Filter todos by list if a list was selected from dropdown
  let filteredTodos = selectedListId
    ? todos.filter((todo) => todo.list === selectedListId)
    : todos;

  // Further filter todos depending on tags selected & whether list has a due date
  if (selectedTags.length > 0)
    filteredTodos = filteredTodos.filter((todo) =>
      filteredLists.map((list) => list.id).includes(todo.list)
    );

  // Further filter todos depending on whether there todo is a habit
  if (showHabits)
    filteredTodos = filteredTodos.filter((todo) => todo.frequency);

  // Finally, filter depending whether the user is viewing only completed todos or not
  if (filteredStatus == "Completed") {
    filteredTodos = filteredTodos.filter(
      (todo) => todo.completed_date
    );
  }
  else if (filteredStatus == "In Progress") {
    filteredTodos = filteredTodos.filter(
      (todo) => (new Date(todo.start_date) <= new Date()) && !todo.completed_date
    );
  }
  else {
    filteredTodos = filteredTodos.filter(
      (todo) => (new Date(todo.start_date) > new Date()) && !todo.completed_date
    );
  }

  // Sort todos based on descending completed_date, ascending due_date and start_date
  filteredTodos = filteredTodos.sort(
    (a, b) =>
      new Date(b.completed_date) - new Date(a.completed_date) ||
      new Date(a.due_date) - new Date(b.due_date) ||
      new Date(a.start_date) - new Date(b.start_date)
  );

  return (
    <>
      {editingTodo && (
        <TodosModal
          lists={lists}
          refreshTodos={refreshTodos}
          setTodo={setEditingTodo}
          todo={editingTodo}
        />
      )}
      <div>
        <Row>
          <Col>
            <Select
              name="tags"
              placeholder="All Tags"
              isMulti
              options={tags.map((tag) => ({ value: tag.id, label: tag.title }))}
              onChange={(e) => { setSelectedTags(e.map((tag) => tag.value)) }}
            />
          </Col>
          <Col md="4">
            <Select
              name="lists"
              placeholder="All Lists"
              isClearable
              options={
                filteredLists.map((list) => ({
                  value: list.id,
                  label: list.title
                }))}
              defaultValue={{
                value: selectedListId,
                label: lists.find((list) => list.id === selectedListId) ?
                  lists.find((list) => list.id === selectedListId).title : 'All Lists'
              }}
              onChange={(list) => setSelectedListId(list ? list.value : '')}
            />
          </Col>
          <Col md="auto">
            <Button
              color="info"
              onClick={() => setEditingTodo({ list: selectedListId })}
            >
              Add todo
            </Button>
          </Col>
        </Row>
        <Form.Check
          type="checkbox"
          label="Habits Only"
          onChange={(e) => { setShowHabits(e.target.checked) }}
        />
        <Nav fill variant="tabs">
          <Nav.Item>
            <Nav.Link
              className={filteredStatus == "Pending" ? "active" : ""}
              onClick={() => setfilteredStatus('Pending')}
            >
              Pending
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={filteredStatus == "In Progress" ? "active" : ""}
              onClick={() => setfilteredStatus('In Progress')}
            >
              In Progress
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={filteredStatus == "Completed" ? "active" : ""}
              onClick={() => setfilteredStatus('Completed')}
            >
              Completed
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Table bordered hover responsive="md" >
          <thead style={{ backgroundColor: "#2D3047", color: "white" }}>
            <tr>
              <th>Title ({filteredTodos.length})</th>
              <th>
                Effort (
                {filteredTodos
                  .reduce((acc, todo) => acc + parseFloat(todo.effort), 0)
                  .toFixed(1)}{" "}
                hrs)
              </th>
              <th>
                Rewards ($
                {filteredTodos
                  .reduce((acc, todo) => acc + parseFloat(todo.reward), 0)
                  .toFixed(1)}
                )
              </th>
              <th>Start Date</th>
              <th>Due Date</th>
              <th>Completed Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.map((todo) => {
              // https://stackoverflow.com/questions/62590455/format-time-interval-in-seconds-as-x-hours-y-minutes-z-seconds
              const formattedEffortHours = formatDuration(
                intervalToDuration({ start: 0, end: todo.effort * 3600_000 })
              );
              const formattedStartDate = formatDays(todo.start_date);
              const formattedDueDate = todo.due_date
                ? formatDays(todo.due_date)
                : "";
              const isOverdue = new Date() > parseISO(todo.due_date);
              return (
                <tr key={todo.id}>
                  <td onClick={() => setEditingTodo(todo)}>
                    {todo.title}
                    <br />
                    <span
                      className="subtitle">
                      {lists.find((list) => list.id === todo.list)?.title}{" "}
                      <Badge bg="dark">{todo.frequency}</Badge>
                    </span>
                  </td>

                  <td>{formattedEffortHours}</td>
                  <td>${todo.reward}</td>
                  <td>
                    {format(parseISO(todo.start_date), "d MMM yy")} <br />
                    {!todo.completed_date &&
                      <b style={{ fontSize: "80%" }}>
                        {formattedStartDate}
                      </b>
                    }
                  </td>
                  <td>
                    {todo.due_date
                      ? format(parseISO(todo.due_date), "d MMM yy")
                      : "None"}{" "}
                    <br />
                    {!todo.completed_date &&
                      <b style={{ fontSize: "80%", color: isOverdue ? "#D33F49" : "black" }}>
                        {formattedDueDate}
                      </b>
                    }
                  </td>
                  <td>
                    {todo.completed_date
                      ? format(parseISO(todo.completed_date), "d MMM yy")
                      : (
                        <Button
                          variant="success"
                          onClick={() => completeTodo(todo)}
                        >
                          Complete
                        </Button>
                      )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};
