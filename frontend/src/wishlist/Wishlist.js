import { format } from "date-fns";
import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardColumns,
  CardImg,
  CardText,
  CardTitle
} from "reactstrap";
import { updateType } from "../api/api";
import { DATA_TYPES } from "../App";
import { formatDays } from "../shared/util";
import { WishlistModal } from "./WishlistModal";

export const Wishlist = ({ availableRewards, refreshWishlist, wishlist }) => {
  const [editingWish, setEditingWish] = useState();

  const redeemWish = (wish) =>
    updateType({ ...wish, 
                  count: wish.count + 1, 
                  last_purchased_date: format(new Date(), "yyyy-MM-dd") }, 
                  DATA_TYPES.WISHLIST)
      .then(refreshWishlist)
      .catch(alert);

  const cards = wishlist.map((wish) => {
    /* A wish is reedeemable if the count is 0, OR it's a repeatable wish
    (a repeatable wish is always redeemable, the count just increases) */
    let isWishRedeemable = wish.count === 0 || wish.repeat;

    return (
      <Card
        key={wish.id}
        onClick={() => setEditingWish(wish)}
        style={{
          backgroundColor: isWishRedeemable ? "#EFE9F4" : "#C8C8C8",
          cursor: "pointer",
        }}
      >
        {wish.img_url && (
          <CardImg
            top
            width="100%"
            src={wish?.img_url}
            alt="img"
            onClick={(e) => {
              e.stopPropagation();
              if (wish?.product_url) {
                window.open(wish?.product_url, "_blank", "noopener,noreferrer");
              } else {
                alert("No Product URL specified");
              }
            }}
          />
        )}

        <CardBody>
          <CardTitle tag="h5">
            {wish.title} x{wish?.count}
          </CardTitle>
          <CardText>
          {wish.last_purchased_date
              && `Purchased ${formatDays(wish.last_purchased_date)}`
                }
          </CardText>
          <CardText>
          {isWishRedeemable && (
            <Button
              color="success"
              onClick={(e) => {
                e.stopPropagation();
                redeemWish(wish);
              }}
              disabled={wish.cost > availableRewards}
            >
              Redeem
            </Button>
          )}
          {" "}${wish.cost}
          </CardText>
        </CardBody>
      </Card>
    );
  });

  return (
    <>
      <Button color="info" onClick={() => setEditingWish({})}>
        Add wish
      </Button>
      <div style={{ padding: "20px" }}>
        {editingWish && (
          <WishlistModal
            wish={editingWish}
            setWish={setEditingWish}
            refreshWishlist={refreshWishlist}
          />
        )}
        <CardColumns style={{ columnCount: "5" }}>{cards}</CardColumns>
      </div>
    </>
  );
};
