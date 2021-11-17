import {Card, Button, CardTitle, CardImg, CardText, CardColumns, CardSubtitle, CardBody} from 'reactstrap';
import React, { useState } from "react";
import { FcClock, FcMoneyTransfer } from "react-icons/fc";

function CustomCard (props){
  const [data] = useState(props.data);
  const [availRewards] = useState(props.availRewards);
  const [activeItemType] = useState(props.activeItemType);

  const renderCards = () => {
    switch(activeItemType) {
      case 'projects': 
      return (
        <CardColumns style = {{columnCount: '4'}}>
        {data.map((item) => {
            return (
        <Card key={item.id} style={{backgroundColor: item.type === "Personal" ? '#E1F0C4' :'#FCDE9C'}}>
        <CardBody >   
        <CardSubtitle tag="h6" className="mb-2 text-muted">{item.type}</CardSubtitle>
          <CardTitle tag="h5" onClick={() => props.onEdit(item, activeItemType)}>{item.title}</CardTitle>
          <CardText>Due {item.duedate}<br></br>
          <FcMoneyTransfer/> Earned ${item.total_rewards} <br></br>
          <FcClock/> Invested {item.total_effort} hrs
          </CardText>
          <CardText>
          <Button color='info' onClick={() => props.onCreate(item, 'todos', '')}>Add todo</Button>&nbsp;
          <Button color="primary" onClick={() => props.onCreate(item, 'todos', 'projects')}>View todos</Button>
          </CardText>
          </CardBody>
          </Card>)})}
          </CardColumns>) 
      case 'habits':
        return (
            <CardColumns style = {{columnCount: '5'}}>
            {data.map((item) => {
                return (
                <Card key={item.id} style={{backgroundColor: item.category === "Learning" ? '#FFEAEE' : item.category === "Financial" ? "#E8F7EA":'#DDF0FF'}}>
                <CardBody >   
                <CardSubtitle tag="h6" className="mb-2 text-muted">{item.category}</CardSubtitle>
                <CardTitle tag="h5" onClick={() => props.onEdit(item, activeItemType)}>{item.title} x{item.total_todos}</CardTitle>
                <CardText>
                <FcMoneyTransfer/> Earned ${item.total_rewards} <br></br>
                <FcClock/> Invested {item.total_effort} hrs
                </CardText>
                <Button color="primary" onClick={() => props.onCreate(item, 'todos', 'habits')}>View todos</Button>
                </CardBody>
                </Card>)})}
          </CardColumns>) 
      case 'wishlist':
        return (
            <CardColumns style = {{columnCount: '5'}}>
            {data.map((item) => {
                return (
                <Card key={item.id} style={{backgroundColor: (item.count === 0 || item.repeat) ? '#EFE9F4' :'#C8C8C8'}}>
                  {(item.imgurl && !item.purchasedate) ? 
                  <a href={item.producturl}><CardImg top width="100%" src={item.imgurl} alt="img" /></a> : null
                }
                <CardBody >   
                <CardTitle tag="h5" onClick={() => props.onEdit(item, activeItemType)}>{item.title} x{item.count}</CardTitle>
                <CardText tag="h6" className="mb-2 text-muted">${item.cost} </CardText>
                {(item.count === 0 || item.repeat) && 
                <Button color="success" onClick={() => props.onSave({ ...item, count: item.count+1 }, 'update')} disabled={item.cost>availRewards}>Redeem</Button>
                }         
                </CardBody>
                </Card>)})}
          </CardColumns>) 
        default:
      return '';
  };
}
  return (
    <div style={{padding: '20px'}}>
    {renderCards()}
    </div>
  )
  }
export default CustomCard;