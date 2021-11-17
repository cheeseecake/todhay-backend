import React, { useState, useEffect } from "react";
import {Button, Input, Navbar, Nav, NavLink } from 'reactstrap';
  
function CustomTable (props){
    const [data, setData] = useState(props.todoData);
    const [activeItem] = useState(props.activeItem);
    const [projectData] = useState(props.projectData);

    const [filteredData, setfilteredData] = useState([]);
    const [dropDownList, setdropDownList] = useState([]);

    const [projectsTab, setProjectsTab] = useState(false);
    const [completeTab, setCompleteTab] = useState(false);
    const [selectedProjectHabit, setSelectedProjectHabit] = useState(false);

    const [selectedProject, setSelectedProject] = useState('');

    const filterProjectHabit = (e) => {
        let { value } = e.target;
        setSelectedProjectHabit(value)
     };

    const refreshTodos = () => {
        fetch('/api/todos/', {method:'GET'})
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.log(err));
    }

     useEffect(() => {
        refreshTodos()
     }, []);
     
    useEffect(() => {
        if (activeItem.view){
            setSelectedProjectHabit(activeItem.title)
            if (activeItem.view === "projects"){
                setProjectsTab(true)
            }
        }
      }, [activeItem]);

    useEffect(() => {
        let filteredData;
        if (projectsTab) {filteredData = data.filter((todo) => todo.project !==  null)}
        else {filteredData = data.filter((todo) => todo.project === null)}
        if (completeTab) {filteredData = filteredData.filter((todo) => todo.completedate !==  null)}
        else {filteredData = filteredData.filter((todo) => todo.completedate === null)}
        setdropDownList([...new Set(filteredData.map(item => item.projecthabit_name))]);
        if (selectedProjectHabit){
            filteredData = filteredData.filter((todo) => todo.projecthabit_name ===  selectedProjectHabit)
            if (projectsTab) {
            setSelectedProject(projectData.filter((project) => project.title === selectedProjectHabit)[0])
            }
        }
        setfilteredData(filteredData)
      }, [projectsTab, completeTab, selectedProjectHabit, data, projectData]);

    return (
        <div>
        <Navbar  expand="md"  bg="dark" variant="light">
        <Nav className="mr-auto" tabs>
            <NavLink className={(projectsTab !== true) ? "active" : ""} onClick={() => setProjectsTab(false)}>Habits</NavLink> 
            <NavLink className={(projectsTab === true) ? "active" : ""} onClick={() => setProjectsTab(true)}>Projects</NavLink>
            <NavLink><Input
                type="select"
                name="select"
                id="select"
                value = {selectedProjectHabit}
                onChange={filterProjectHabit}
                >   
                <option value=''>All</option>
                {dropDownList.map(item => {
                    return (
                        <option key={item} name={item}>
                        {item}
                        </option>
                    );
                    })}
            </Input></NavLink>
            <NavLink>
                {projectsTab === true && <Button color='info' onClick={() => props.onCreate(selectedProject, 'todos', '')}>Add todo</Button>}
            </NavLink>
        </Nav>
          <Nav className="ml-auto" tabs>
              <NavLink className={(completeTab !== true) ? "active" : ""} onClick={() => setCompleteTab(false)}>In Progress/ Backlog</NavLink>
              <NavLink className={(completeTab === true) ? "active" : ""} onClick={() => setCompleteTab(true)}>Completed</NavLink>
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
            <tr key={todo.id} style={{backgroundColor: todo.days_to_start <=1 ? '#E8EBF7':'white' }}>
            <td onClick={() => props.onEdit(todo, 'todos')} >{todo.title}<br></br>
                {todo.project && <i><b style={{fontSize:'80%', color: '#597AB1'}}>{todo.projecthabit_name}</b></i>}
                </td>
            <td>{todo.effort <= 1 ? todo.effort*60 :todo.effort*1}{todo.effort <= 1 ? ' minutes' :' hrs'} </td>
            <td>${todo.reward}</td>
            <td>{todo.startdate} <br></br><b style={{fontSize:'80%'}}>in {todo.days_to_start} day(s)</b></td>
            <td>{todo.duedate} <br></br><b style={{fontSize:'80%', color: todo.days_to_due <1 ? "#D33F49": 'black'}}>in {todo.days_to_due} day(s)</b></td>
            <td>
                {todo.completedate ? todo.completedate :
                <Button color="success" onClick={() => handleSave(todo, 'complete'), refreshTodos()}>Complete</Button>}
            </td>
            </tr>);
            })}
            </tbody>  
        </table>
        </div>
        </div> 
    )
}
export default CustomTable;
