import React, { Component } from "react";
import {Button, Input } from 'reactstrap';
import {
    Navbar,
    Nav,
    NavLink,
  } from 'reactstrap';
export default class CustomTable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: this.props.data,
        projects: true,
        complete: false,
        selectedProjectHabit: false,
        projectData: this.props.projectData

      };
    }
filterProjectHabit = (e) => {
    let { value } = e.target;
    this.setState({ selectedProjectHabit: value})
    };
render() {
    const { data, onEdit, onSubmit, onCreate, projectData } = this.props;
    const { projects, complete, selectedProjectHabit} = this.state;
    let filteredData, dropDownList;
    if (projects) {
        filteredData = data.filter((todo) => todo.project !==  null)
    }
    else {
        filteredData = data.filter((todo) => todo.project === null)
    }
    if (complete) {
        filteredData = filteredData.filter((todo) => todo.completedate !==  null)
    }
    else {
        filteredData = filteredData.filter((todo) => todo.completedate === null)
        // if (!projects){
        //     filteredData = filteredData.filter((todo) => todo.frequency !== "Daily" || todo.title === "Journal")
        // }
    }
    dropDownList = [...new Set(filteredData.map(item => item.projecthabit_name))];
    let selectedProject;
    selectedProject = '';
    if (selectedProjectHabit){
        filteredData = filteredData.filter((todo) => todo.projecthabit_name ===  selectedProjectHabit)
        if (projects) {
            selectedProject = projectData.filter((project) => project.title === selectedProjectHabit)[0]
        }
    }
    return (
        <div>

        <Navbar  expand="md"  bg="dark" variant="light">
        <Nav className="mr-auto" tabs>
            <NavLink className={(this.state.projects === true) ? "active" : ""} onClick={() => this.setState({ projects: true, selectedProjectHabit: false})}>Projects</NavLink>
            <NavLink className={(this.state.projects !== true) ? "active" : ""} onClick={() => this.setState({ projects: false, selectedProjectHabit: false})}>Habits</NavLink> 
            <NavLink><Input
        type="select"
        name="select"
        id="select"
        onChange={this.filterProjectHabit}
        >
        <option value=''>Show All</option>
        {dropDownList.map(item => {
            return (
                <option key={item} name={item}>
                {item}
                </option>
            );
            })}
        </Input></NavLink>
        <NavLink><Button color='info' onClick={() => onCreate(selectedProject, 'todos')}>Add todo</Button></NavLink>
        </Nav>
          <Nav className="ml-auto" tabs>
              <NavLink className={(this.state.complete !== true) ? "active" : ""} onClick={() => this.setState({ complete: false})}>In Progress/ Backlog</NavLink>
              <NavLink className={(this.state.complete === true) ? "active" : ""} onClick={() => this.setState({ complete: true})}>Completed</NavLink>
          </Nav>
          </Navbar>

        <div className="table-responsive">
        <table className="table table-bordered table-hover dataTables-example" >
        <thead style={{backgroundColor: '#2D3047', color:'white'}}>
            <tr>
            <th>Title ({filteredData.length})</th>
            <th>Effort ({filteredData.reduce((accumulator, todo) => accumulator + parseFloat(todo.effort), 0).toFixed(1)} hrs)</th>
            <th>Rewards (${filteredData.reduce((accumulator, todo) => accumulator + parseFloat(todo.reward), 0).toFixed(1)})</th>
            <th>Start Date</th>
            <th>Due Date</th>
            <th>Complete Date</th>
            </tr>
        </thead>
        <tbody>
        {filteredData.map((todo) => {
            return (
            <tr key={todo.id} style={{backgroundColor: todo.days_to_start <1 ? '#E8EBF7':'white' }}>
            <td onClick={() => onEdit(todo, 'todos')} >{todo.title}<br></br>
                {todo.project && <i><b style={{fontSize:'80%', color: '#597AB1'}}>{todo.projecthabit_name}</b></i>}
                </td>
            <td>{todo.effort < 1 ? todo.effort*60 :todo.effort*1}{todo.effort < 1 ? ' minutes' :' hrs'} </td>
            <td>${todo.reward}</td>
            <td>{todo.startdate} <br></br><b style={{fontSize:'80%'}}>in {todo.days_to_start} day(s)</b></td>
            <td>{todo.duedate} <br></br><b style={{fontSize:'80%', color: todo.days_to_due <1 ? "#D33F49": 'black'}}>in {todo.days_to_due} day(s)</b></td>
            <td>
                {todo.completedate ? todo.completedate :
                <Button color="success" onClick={() => onSubmit(todo, 'complete')}>Complete</Button>}
            </td>
            </tr>);
            })}
            </tbody>  
        </table>
        </div>
        </div> 
    );
}
}