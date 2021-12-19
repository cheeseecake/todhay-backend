import React, { useRef } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { createType, deleteType, updateType } from "../api/api";
import { DATA_TYPES } from "../App";

export const WishlistModal = ({ refreshWishlist, setWish, wish }) => {
  const formRef = useRef();

  const onSubmit = () => {
    const id = wish?.id;

    const wishData = {
      title: formRef.current.title.value,
      cost: formRef.current.cost.value,
      repeat: !!formRef.current.repeat.value,
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
    <Modal isOpen toggle={() => setWish(null)} className="modal-lg">
      <ModalHeader>
        /{DATA_TYPES.WISHLIST.apiName}/{wish?.id || "<New Wish>"}
      </ModalHeader>
      <ModalBody>
        <Form id={"form"} innerRef={formRef}>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              type="text"
              name="title"
              defaultValue={wish?.title}
              placeholder="Title"
              required
            />
          </FormGroup>

          <Row form>
            <Col md={4}>
              <FormGroup>
                <Label for="cost">Cost ($)</Label>
                <Input
                  type="number"
                  id="cost"
                  name="cost"
                  defaultValue={wish?.cost}
                />
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label for="type">Repeat?</Label>
                <Input type="select" name="repeat" defaultValue={wish?.repeat}>
                  <option value={""}>false</option>
                  <option value={"true"}>true</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="end_date">Last Purchased Date</Label>
                <Input
                  type="date"
                  name="last_purchased_date"
                  defaultValue={wish?.last_purchased_date}
                />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label for="imgurl">Image URL</Label>
            <Input type="text" name="img_url" defaultValue={wish?.img_url} />
          </FormGroup>

          <FormGroup>
            <Label for="producturl">Product URL</Label>
            <Input
              type="text"
              name="product_url"
              defaultValue={wish?.product_url}
            />
          </FormGroup>
          
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onDelete}>Delete</Button>
        <Button color="primary" onClick={onSubmit}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};
