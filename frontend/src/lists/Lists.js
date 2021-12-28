import { format, parseISO } from "date-fns";
import React, { useState } from "react";
import { FcTodoList, FcClock, FcMoneyTransfer } from "react-icons/fc";
import { Badge, Button, Card, Row, Col, Form } from "react-bootstrap";
import Select from "react-select";
import { formatDays } from "../shared/util";
import { ListsModal } from "./ListsModal";

export const Lists = ({
  lists,
  refreshLists,
  tags,
  todos,
  viewTodosFromListId,
}) => {
  const [editingList, setEditingList] = useState();
  const [selectedTags, setSelectedTags] = useState([]);

  const [showHabits, setShowHabits] = useState(false);

  // Filter list selection by tag if a tag was selected from autocomplete field,
  // or if no tag was selected show everything
  let filteredLists = selectedTags.length > 0
    ? lists
      .filter((list) => list.tags.some(tag => selectedTags.includes(tag)))
    : lists;

  // Further filter lists depending on whether list has a due date
  if (showHabits)
    filteredLists = filteredLists.filter((list) => !list.due_date);

  // Sort list by due date
  filteredLists = filteredLists.sort(
    (a, b) =>
      new Date(a.due_date) - new Date(b.due_date)
  );

  const cards = filteredLists.map((list) => {
    // Only count completed todos in calculating effort and earnings
    const completedTodosInList = todos.filter(
      (todo) => todo.list === list.id && !!todo.completed_date
    );
    const totalEffort = completedTodosInList.reduce(
      (acc, todo) => acc + parseFloat(todo.effort),
      0
    );
    const totalRewards = completedTodosInList.reduce(
      (acc, todo) => acc + parseFloat(todo.reward),
      0
    );

    const totalPendingTodos = todos.filter(todo => !todo.completed_date && todo.list === list.id).length

    return (

      <Col key={list.id}>
        <Card
          key={list.id}
          style={{
            backgroundColor:
              list.due_date ? "#E0EBF5" :
                list.completed_date ? "#EFFAF5" : "#E4EFF1",
          }}
        >
          <Card.Body
            style={{ cursor: "pointer" }}
            onClick={() => setEditingList(list)}
          >
            <Card.Title tag="h5">{list.title}</Card.Title>
            <Card.Subtitle className="subtitle">
              {list.due_date
                && `Due ${formatDays(list.due_date)} (${format(
                  parseISO(list.due_date),
                  "d MMM yy"
                )})`
              }
            </Card.Subtitle>
            <Card.Text>
              <FcTodoList /> {completedTodosInList.length} todos{" "}
              <FcMoneyTransfer /> ${totalRewards.toFixed(1)}{" "}
              <FcClock /> {totalEffort.toFixed(1)} hrs
            </Card.Text>
            <Card.Text>
              {list.tags.map(id => (
                <Badge pill key={id}
                  bg={tags.find(tag => tag.id === id).topic ? "secondary" : "light"}
                  text={tags.find(tag => tag.id === id).topic ? "light" : "dark"}
                  style={{ margin: '5px 5px 5px 0' }}>
                  {tags.find(tag => tag.id === id).title}
                </Badge>
              ))}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Button
              variant="outline-dark"
              onClick={(e) => {
                e.stopPropagation();
                viewTodosFromListId(list.id);
              }}
            >
              View todos ({totalPendingTodos})
            </Button>
          </Card.Footer>
        </Card>
      </Col>
    );
  });

  return (
    <>
      <Row>
        <Col md="auto">
          <Select
            name="tags"
            placeholder="All Tags"
            isMulti
            options={tags.map((tag) => ({ value: tag.id, label: tag.title }))}
            onChange={(e) => setSelectedTags(e.map((tag) => tag.value))}
          />
        </Col>
        <Col md="auto">
          <Button color="info" onClick={() => setEditingList({})} >
            Add list
          </Button>
        </Col>
        <Col md="auto">
          <Form.Check
            type="checkbox"
            label="Habits Only"
            onChange={(e) => { setShowHabits(e.target.checked) }}
          />
        </Col>
      </Row>
      <br />
      {editingList && (
        <ListsModal
          list={editingList}
          setList={setEditingList}
          tags={tags}
          refreshLists={refreshLists}
        />
      )}
      <Row xs={1} md={3} lg={4} className="g-3">
        {cards}
      </Row>
    </>
  );
};
