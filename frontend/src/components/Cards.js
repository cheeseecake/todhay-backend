import {Card, Button, CardTitle, CardImg, CardText, CardColumns, CardSubtitle, CardBody} from 'reactstrap';
import React, { Component } from "react";

export default class CustomCard extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: this.props.data,
        activeItemType: this.props.activeItemType,
        availRewards: this.props.availRewards,
      };
    }
    renderCards = () => {
        const { data, activeItemType, availRewards } = this.props;
        const { onEdit, onCreate, onSubmit } = this.props;
        switch(activeItemType) {
          case 'projects': 
          return (
            <CardColumns style = {{columnCount: '5'}}>
            {data.map((item) => {
                return (
            <Card key={item.id} style={{backgroundColor: item.type === "Personal" ? '#E1F0C4' :'#FCDE9C'}}>
            <CardBody >   
            <CardSubtitle tag="h6" className="mb-2 text-muted">{item.type}</CardSubtitle>
              <CardTitle tag="h5" onClick={() => onEdit(item, activeItemType)}>{item.title}</CardTitle>
              <CardText>Due on: {item.duedate},  Due on: {item.duedate}<br></br>
              Total rewards: ${item.total_rewards} <br></br>
              Total effort: {item.total_effort} hrs
              </CardText>
              <Button color='info' onClick={() => onCreate(item, 'todos')}>Add todo</Button>
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
                    <CardTitle tag="h5" onClick={() => onEdit(item, activeItemType)}>{item.title} x {item.count}</CardTitle>
                    <CardText>
                    Total rewards earned: ${item.total_rewards} <br></br>
                    Total effort invested: {item.total_effort} hrs
                    </CardText>
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
                    <CardTitle tag="h5" onClick={() => onEdit(item, activeItemType)}>{item.title} x {item.count}</CardTitle>
                    <CardText tag="h6" className="mb-2 text-muted">${item.cost} </CardText>
                    {(item.count === 0 || item.repeat) && 
                    <Button color="success" onClick={() => onSubmit({ ...item, count: item.count+1 }, 'update')} disabled={item.cost>availRewards}>Redeem</Button>
                    }         
                    </CardBody>
                    </Card>)})}
              </CardColumns>) 
            default:
          return '';
      };
    };
render() {
    return (
    <div style={{padding: '20px'}}>
    {this.renderCards()}
    </div>)
}
}