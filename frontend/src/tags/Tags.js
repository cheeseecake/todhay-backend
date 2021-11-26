import { useState } from "react";
import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardColumns,
  CardText,
  CardTitle,
} from "reactstrap";
import { TagsModal } from "./TagsModal";

export const Tags = ({ refreshTags, tags, lists, todos }) => {
  const [editingTag, setEditingTag] = useState();

  const cards = tags.map((tag) => {
    const listsWithTag = lists.filter((list) => list.tags.includes(tag.id));
    const numLists = listsWithTag.length;
    const numPendingTodos = todos.filter((todo) =>
      !todo.completed_date && listsWithTag.map((list) => list.id).includes(todo.list)
    ).length;

    return (
      <Card
        key={tag.id}
        onClick={() => setEditingTag(tag)}
        style={{ cursor: "pointer" }}
      >
        <CardBody>
          <CardTitle tag="h5">{tag.title}</CardTitle>
          <CardText tag="h6" className="mb-2 text-muted">
            {numLists} list{numLists !== 1 && 's'} ({numPendingTodos} todo{numPendingTodos !== 1 && 's'})
          </CardText>
        </CardBody>
      </Card>
    );
  });

  return (
    <>
      <Button color="info" onClick={() => setEditingTag({})}>
        Add tag
      </Button>
      <div style={{ padding: "20px" }}>
        {editingTag && (
          <TagsModal
            tag={editingTag}
            setTag={setEditingTag}
            refreshTags={refreshTags}
          />
        )}
        <CardColumns style={{ columnCount: "5" }}>{cards}</CardColumns>
      </div>
    </>
  );
};
