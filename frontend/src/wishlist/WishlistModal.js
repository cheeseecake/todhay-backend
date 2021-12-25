import React, { useRef } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { createType, deleteType, updateType } from "../api/api";
import { DATA_TYPES } from "../App";

export const WishlistModal = ({ refreshWishlist, setWish, wish, tags }) => {

  const formRef = useRef();

  const onSubmit = () => {
    const id = wish?.id;

    const wishData = {
      title: formRef.current.title.value,
      tags: formRef.current.tags.length > 1
        ? Array.from(formRef.current.tags, (tag) => parseInt(tag.value))
        : formRef.current.tags.value
          ? [parseInt(formRef.current.tags.value)]
          : []
      ,
      cost: formRef.current.cost.value,
      repeat: formRef.current.repeat.value,
      img_url: formRef.current.img_url.value,
      product_url: formRef.current.product_url.value,
      last_purchased_date: formRef.current.last_purchased_date.value || null,
    };

    const operation = id
      ? updateType({ id, ...wishData }, DATA_TYPES.WISHLIST) // Existing wish
      : createType(wishData, DATA_TYPES.WISHLIST); // New wish

    operation
      .then(() => {
        refreshWishlist();
        setWish(null);
      })
      .catch(alert);
  };

  const onDelete = () =>
    window.confirm(`Delete '${wish.title}?'`) &&
    deleteType(wish, DATA_TYPES.WISHLIST).then(() => {
      refreshWishlist();
      setWish(null);
    });

  return (
    <Modal show onHide={() => setWish(null)} size="lg" backdrop="static">
      <Modal.Header closeButton>
        /{DATA_TYPES.WISHLIST.apiName}/{wish?.id || "<New Wish>"}
      </Modal.Header>
      <Modal.Body>
        <Form id={"form"} ref={formRef}>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label for="title">Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  defaultValue={wish?.title}
                  placeholder="Title"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label for="tags">Tags</Form.Label>
                <Select
                  name="tags"
                  placeholder="Tags"
                  closeMenuOnSelect={false}
                  isMulti
                  defaultValue={tags
                    .filter((tag) => wish.tags?.includes(tag.id))
                    .map((tag) => ({ value: tag.id, label: tag.title }))}
                  options={tags
                    .map((tag) => ({ value: tag.id, label: tag.title }))}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label for="cost">Cost ($)</Form.Label>
                <Form.Control
                  type="number"
                  id="cost"
                  name="cost"
                  defaultValue={wish?.cost}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label for="type">Repeat?</Form.Label>
                <Form.Select name="repeat" defaultValue={wish?.repeat}>
                  <option value={"false"}>false</option>
                  <option value={"true"}>true</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label for="end_date">Last Purchased Date</Form.Label>
                <Form.Control
                  type="date"
                  name="last_purchased_date"
                  defaultValue={wish?.last_purchased_date}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <Form.Label for="imgurl">Image URL</Form.Label>
            <Form.Control type="text" name="img_url" defaultValue={wish?.img_url} />
          </Form.Group>

          <Form.Group>
            <Form.Label for="producturl">Product URL</Form.Label>
            <Form.Control
              type="text"
              name="product_url"
              defaultValue={wish?.product_url}
            />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={onDelete}>Delete</Button>
        <Button variant="success" onClick={onSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal >
  );
};
