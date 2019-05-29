import React from "react";
import ReactDOM from "react-dom";

//import Table from "react-bootstrap/Table";

import ListGroup from "react-bootstrap/ListGroup";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
//import DropdownButton from "react-bootstrap/DropdownButton";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Alert from "react-bootstrap/Alert";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";

//Import react-table
import ReactTable from "react-table";
// import "react-table/react-table.css";

import "./index.css";
// import "./schedule.js";

//import service worker for progressive web app
import * as serviceWorker from './serviceWorker';

// import Class from "./class.js";

//Datastore
import CoursesStore from "./CoursesStore.js";
// const CoursesStore = require("./CoursesStore.js");






class ScheduleApp extends React.Component {
    constructor(props) {
        super(props);
        this.makeSchedules = this.makeSchedules.bind(this);
        this.prepareSchedule = this.prepareSchedule.bind(this);
        // this.ids = 0;

        //to remove
        this.state = {
            schedules: [],
            // courses: [new Class("A", "A", [0, 3], this.ids++), new Class("B", "B", [0, 2, 3], this.ids++), new Class("C", "C", [0, 1], this.ids++), new Class("D", "D", [2, 3], this.ids++)],
            blocks: 4,
            //reservedBlocks: []
            //make use of reservedBlocks to increase efficiency
        };


    }



    prepareSchedule(classes) {
        //Prepare schedules
        let classTimes = [];
        let numOfBlocks = CoursesStore.getBlocks();
        classTimes.length = numOfBlocks;

        let reservedBlocks = [];

        //need to manually fill it
        for (let i = 0; i < numOfBlocks; ++i) {
            classTimes[i] = [];
        }

        for (let c of classes) {
            if (c.offeredBlocks.length < 2) {
                //Two classes only available at same time
                if (reservedBlocks.includes(c.offeredBlocks[0])) {
                    //Add handle error 
                    // console.log("No possible schedule");
                    break;
                }

                let block = c.offeredBlocks[0];
                reservedBlocks.push(block);

                //possibleBlocks currently not used
                c.possibleBlocks.push(block);
            }

            for (let block of c.offeredBlocks) {
                // console.log(block);
                if (!reservedBlocks.includes(block)) {
                    c.possibleBlocks.push(block);
                }

                let classesInBlock = classTimes[block];

                if (classesInBlock !== undefined) {
                    classesInBlock.push(c);
                }
            }
        }

        /* for (let classes of classTimes) {
            //if one block has only one class available, 
            if (classes.length < 2) {

            }
        } */

        // console.log(classTimes);
        return classTimes;
    }

    makeSchedules(blocksPossibleClasses) {

        let possibleSchedules = [];

        //if only one block in blocksArray, then have reached end of recursion. Return values.
        if (blocksPossibleClasses.length < 2) {

            //Create array with each class in a separate index
            return blocksPossibleClasses[0].map(val => [val]);
        }
        else {
            for (let aClass of blocksPossibleClasses[0]) {

                //nested array of removals from each block in blocksPossibleClasses
                let removals = [];
                removals.length = blocksPossibleClasses.length;
                for (let i = 0, n = blocksPossibleClasses.length; i < n; ++i) {
                    removals[i] = [];
                }

                // let classPossibleSchedules = [];

                //make deep copy of blocksPossibleClasses
                //let tempPossibleSchedules = JSON.parse(JSON.stringify(blocksPossibleClasses));

                //for each block, remove all occurances of the current class in the current block
                //skipping current block.
                for (let i = 1, n = blocksPossibleClasses.length; i < n; ++i) {
                    let m;
                    while ((m = blocksPossibleClasses[i].indexOf(aClass)) !== -1) {
                        removals[i].push(aClass);
                        blocksPossibleClasses[i].splice(m, 1);
                    }
                }

                //flag for whether shedule is impossible with the current class
                let noSchedule = false;
                for (let block of blocksPossibleClasses) {
                    if (block.length < 1) {
                        noSchedule = true;
                        // break;
                    }
                }

                if (noSchedule) {
                }
                else {
                    let partialPossibleSchedules = this.makeSchedules(blocksPossibleClasses.slice(1));

                    //iterate through the returned possible schedules
                    for (let partialSchedule of partialPossibleSchedules) {
                        possibleSchedules.push([aClass].concat(partialSchedule));
                    }



                    //possibleSchedules.push(makeSchedules(blocksPossibleClasses.slice(1), currSchedule.push(block)));
                }

                //add back in the removed classes
                for (const [i, el] of removals.entries()) {
                        //need to modify original blocksPossibleClasses

                        //blocksPossibleClasses[i] = blocksPossibleClasses[i].concat(el);
                        blocksPossibleClasses[i].push(...el);                    
                }
                removals = [];
            }
            return possibleSchedules;
        }

    }

    render() {
        // console.log(this.state.courses);
        return (
            //later: add Tab to switch between output and input
            //<ScheduleDisplay schedules={this.state.schedules} />
            <>
                <Navbar bg="light">
                    <Navbar.Brand>Schedule Maker</Navbar.Brand>
                </Navbar>
                <Tabs
                    onSelect={(key) => {
                        if (key === "output") {
                            let classes = this.prepareSchedule(CoursesStore.getCourses());
                            // console.log(classes);
                            let schedules = this.makeSchedules(classes);


                            // this.setState({
                            //     schedules: this.makeSchedules(classes)
                            // });

                            // console.log(schedules);

                            this.setState({
                                schedules
                            })
                        }
                    }}
                >
                    <Tab eventKey="input" title="Input">
                        <CourseInput courses={this.state.courses} scheduleApp={this} />
                    </Tab>
                    <Tab eventKey="output" title="Output">
                        <ScheduleDisplay schedules={this.state.schedules} scheduleApp={this} />
                    </Tab>
                </Tabs>
            </>
        )
    }
}



/* function ScheduleRow(props) {
    return (
        <>
            {console.log(props)}
            {global.schedules.map(element => (
                <td>
                    {element[props.block].name}
                </td>
            ))}
        </>
    )
} */

class ScheduleDisplay extends React.Component {
    /* constructor(props) {
        super(props);
    } */

    render() {
        //let headerArray = [];

        //create table headers
        /* for (let i = 0; i < global.numOfBlocks; ++i) {
            headerArray.push(
                <div>{i}</div>
            );
        } */

        /* let tableHeaderArray = new Array(global.numOfBlocks).fill(null);
        //create table headers
        for (let i = 0; i < global.numOfBlocks; ++i) {
            tableHeaderArray.push(
                <tr>
                    <th class="header">{i}</th>
                    <ScheduleRow block={i} />
                </tr>
            );
        } */


        /* let tempColumns = [];
        for (let i = 1; i < global.numOfBlocks; ++i) {
            //add column header for each block
            tempColumns.push({
                id: "block" + i,
                Header: "",
                accessor: d => d[i]
            });
        } */

        /* function processData(data) {
            let tempData = [];

            for (let i = 0; i < global.numOfBlocks; ++i) {
                //add block number beginning to each row
                tempData.push([i + 1]);
            }


            for (let schedule of data) {
                for (let [index, course] of schedule.entries()) {
                    tempData[index].push(course.name);
                }
            }

            return tempData;
        } */



        const data = this.props.schedules;
        // const appInstance = this.props.scheduleApp;

        let columns = [];

        const blocks = CoursesStore.getBlocks();

        let errorAlert = (
            <Alert variant="danger">
                <Alert.Heading>Unable to create schedule</Alert.Heading>
                <p>There are no possible schedules from your classes. Make sure you have at least {blocks} classes. If you believe this is a mistake, please leave an bug report on Github.</p>
            </Alert>
        );

        if (isNaN(blocks)) {
            return errorAlert;
        }

        for (let i = 0; i < blocks; ++i) {
            columns.push(
                /* {
                    Header: "Block " + (i + 1),
                    id: "block" + (i + 1),
                    // accessor: d => d[i].name,
                    columns: [{
                        id: "class" + (i + 1),
                        Header: "Class",
                        accessor: d => d[i].name
                    },
                    {
                        id: "teacher" + (i + 1),
                        Header: "Teacher",
                        style: {borderRight: "1px solid rgba(0, 0, 0, 0.2"},
                        aggregate: (values, rows) => values.length,
                        Aggregated: row => {
                            return (
                                <span>
                                    ({row.value})
                                </span>
                            )
                        },
                        accessor: d => d[i].teacher
                    }]
                } */
                {
                    id: "class" + (i + 1),
                    Header: "Block " + (i + 1),
                    style: {borderRight: "1px solid rgba(0, 0, 0, 0.2"},
                    accessor: d => d[i].name
                }
            )
        }


        /* const columns = [{
            Header: "",
            fixed: "left",
            columns: [
                {
                    id: "header",
                    Header: "Block",
                    width: 80,
                    accessor: d => d[0]
                }
            ]
        }].concat({Header:"Classes",
            headerClassName: "classes-header-group",
            columns: tempColumns}); */


        const DEFAULT_SORT = [
            {
                id: "block1",
                desc: false
            }
        ];

        if (data.length < 1) {
            return errorAlert;
        }
        else {
            return (
                <ReactTable
                    style={{ padding: "10px"}}
                    data={data}
                    columns={columns}
                    className="-striped -highlight"
                    defaultSorted={DEFAULT_SORT}
                    filterable={true}
                    SubComponent={row => {
                        return (
                            <div className="rt-tr">
                            <div className="rt-td" style={{flex: "35 0 auto", width: "35px", maxWidth: "35px", wordWrap: "break-word"}}>Teacher</div>
                                {row.original.map((val , index) =>
                                    <div key={index} className="rt-td" style={{flex: "100 0 auto", width: "100px"}}>{val.teacher}</div>
                                )}
                            </div>
                        )
                    }}
                />
            )
        }








        /* return (
            <>
            <div class="header">
                {headerArray}
            </div>
            {global.schedules.map(element => (
            <div class="schedule">
                <Schedule classes={element}></Schedule>
            </div>))}
            </>
        ) */


        /* return (
            <div class="tableContainer">
                <Table striped hover>
                    <tbody>
                        <tr>
                            <th class="header">Block</th>
                            <td class="invisibleHeader">B</td>
                            <td></td>
                            <td></td>
                        </tr>
                        {tableHeaderArray}
                    </tbody>
                </Table>
            </div>
        ) */


    }
}

class CourseInput extends React.Component {
    constructor(props) {
        super(props);
        // this.addCourse = this.addCourse.bind(this);
        // this.removeCourse = this.removeCourse.bind(this);
        this.state = {
            courses: CoursesStore.getCourses()
        };
        this.onAddRemove = this.onAddRemove.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onAddRemove() {
        this.setState({
            courses: CoursesStore.getCourses()
        });
    }
 
    componentWillMount() {
        CoursesStore.subscribeAddRemove(this.onAddRemove);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.courses.length !== this.state.courses.length) {
            return true;
        }
        return false;
    }

    handleChange(event) {
        // let newValue = parseInt(event.target.value);
        CoursesStore.changeBlocks(parseInt(event.target.value));
        this.forceUpdate();
    }

    getInputValue() {
        let n;
        if (isNaN((n = CoursesStore.getBlocks()))) {
                return "";
        }
        return n;
    }

    /* addCourse(index, appInstance) {
        appInstance.setState({
            courses: appInstance.state.courses.slice(0, index + 1).concat(new Class("", "", [], appInstance.ids++), appInstance.state.courses.slice(index + 1, appInstance.state.courses.length))
        });
    }

    /*removeCourse(index, appInstance) {
        let newCourses = appInstance.state.courses.slice();
        newCourses.splice(index, 1);
        //console.log(index);
        appInstance.setState({
            courses: newCourses
        });
    }

    handleOnChange(event, index, appInstance) {

        let propName = event.target.name;
        let value = appInstance.state.courses.slice();
        value[index][propName] = event.target.value;

        appInstance.setState({
            [propName]: value
        });
    } */

    render() {
        const appInstance = this.props.scheduleApp;
        // console.log(this.state.courses);
        return (
            <>
            <Form.Group controlId="blocksInput">
                <Form.Label>Number of blocks:</Form.Label>
                <Form.Control value={this.getInputValue()} onChange={this.handleChange} type="number" min="1"/>
            </Form.Group>
            <ListGroup>
                {
                    this.state.courses.map((course, index) => 
                    <CourseInputRow 
                        key={course.id}
                        name={course.name}
                        index={index}
                        teacher={course.teacher}
                        offeredBlocks={course.offeredBlocks}
                        appInstance={appInstance}
                    />
                    )
                }
            </ListGroup>
            </>
        )
    }

}


class CourseInputRow extends React.Component {
    constructor(props) {
        super(props);
        this.addCourse = this.addCourse.bind(this);
        this.removeCourse = this.removeCourse.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onCourseUpdate = this.onCourseUpdate.bind(this);
        this.onBlockUpdate = this.onBlockUpdate.bind(this);
        this.state = {
            course: CoursesStore.getCourses()[this.props.index].clone(),
            blocks: CoursesStore.getBlocks()
        };

        // console.log(this.state.course);
    }

    addCourse(index, appInstance) {
        // appInstance.setState({
        //     courses: appInstance.state.courses.slice(0, index + 1).concat(new Class("", "", [], appInstance.ids++), appInstance.state.courses.slice(index + 1, appInstance.state.courses.length))
        // });
        CoursesStore.addCourse(index);
    }

    removeCourse(index, appInstance) {
        // let newCourses = appInstance.state.courses.slice();
        // newCourses.splice(index, 1);
        // //console.log(index);
        // appInstance.setState({
        //     courses: newCourses
        // });
        // console.log(index);
        CoursesStore.removeCourse(index);
    }

    handleChange(event, index, appInstance) {
        // let propName = event.target.name;
        // let value = appInstance.state.courses.slice();
        // value[index][propName] = event.target.value;

        // appInstance.setState({
        //     [propName]: value
        // });

        // console.log("change");
        // console.log(event.target.name);
        // console.log(event.target.value);

        // console.log(this.state.course.name);

        //event.target.name is set to the name of the property it corresponds to in the Class class.
        CoursesStore.updateCourse(index, {
            [event.target.name]: event.target.value
        });

    }

    onCourseUpdate() {

        //not a general purpose function for checking any array, just in this case where I know both are arrays (not objects or maps, for instance)
        function arraysEqual(arr1, arr2) {
            if (arr1.length !== arr2.length) return false;
            for (const i in arr1) {
                if (arr1[i] !== arr2[i]) return false;
            }
            return true;
        }
        // console.log("Setting Course");
        // console.log("Before:" + this.state.course.name);

        //check if state is same so doesn't call setState and have to go through shouldComponentUpdate
        let newCourse = CoursesStore.getCourses()[this.props.index].clone();

        if (newCourse.name !== this.state.course.name || newCourse.teacher !== this.state.course.teacher ||
            newCourse.id !== this.state.course.id ||  !arraysEqual(newCourse.offeredBlocks, this.state.course.offeredBlocks)) {
                this.setState({
                    course: newCourse
                });
            }

        // console.log("After:" + this.state.course.name);
        
    }

    onBlockUpdate() {
        const newBlocks = CoursesStore.getBlocks();
        if (!isNaN(newBlocks)) {
            this.setState({
            blocks: newBlocks
        });
        }
    }

    componentWillMount() {
        CoursesStore.subscribeUpdate(this.onCourseUpdate);
        CoursesStore.subscribeBlocksChange(this.onBlockUpdate);
    }

    componentWillUnmount() {
        CoursesStore.unsubscribeUpdate(this.onCourseUpdate);
        CoursesStore.unsubscribeBlocksChange(this.onBlockUpdate);
    }

    /* shouldComponentUpdate(nextProps, nextState) {
        if (this.state.course.name !== nextState.course.name || this.state.course.teacher !== nextState.course.teacher ||
            this.state.course.offeredBlocks !== nextState.course.offeredBlocks || nextProps.teacher !== this.props.teacher
            || nextProps.offeredBlocks !== this.props.offeredBlocks || nextProps.index !== this.props.index) {
            console.log("Different");
            return true;
        }
        return false;
    } */

    render() {

        //required props:
        //name, teacher, offeredBlocks, index, appInstance
        const index = this.props.index;
        const appInstance = this.props.appInstance;

        return (
            <ListGroup.Item>
                    <Form.Group controlId={"courseInput" + index}>
                        <Form.Label>Class Name</Form.Label>
                        <Form.Control
                            placeholder="Class Name"
                            name="name"
                            value={this.state.course.name}
                            onChange={(event) => this.handleChange(event, index, appInstance)}/>
                    </Form.Group>
                    <Form.Group controlId={"courseInput" + index}>
                        <Form.Label>Teacher</Form.Label>
                        <Form.Control
                            placeholder="Teacher"
                            name="teacher"
                            value={this.state.course.teacher}
                            onChange={(event) => this.handleChange(event, index, appInstance)}/>
                    </Form.Group>
                {/* <form>
                    <div style={{ display: "inline-block" }}>
                        <label htmlFor="nameInput" style={{marginRight: "4px"}}>Course Name: </label>
                        <input
                            id="nameInput"
                            className="courseInput"
                            placeholder="Class name"
                            type="text"
                            name="name"
                            value={this.state.course.name}
                            onChange={(event) => this.handleChange(event, index, appInstance)}
                        ></input>
                        <label htmlFor="teacherInput" style={{marginRight: "4px"}}>Teacher: </label>
                        <input
                            id="teacherInput"
                            className="courseInput"
                            placeholder="Teacher"
                            type="text"
                            name="teacher"
                            value={this.state.course.teacher}
                            onChange={(event) => this.handleChange(event, index, appInstance)}
                        >
                        </input>
                    </div> */}
                    <div className="input-button-group">
                    <ButtonGroup style={{ marginRight: "4px", paddingBottom: "5px" }}>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary">Offered Blocks</Dropdown.Toggle>
                            <Dropdown.Menu style={{ padding: "0" }}>
                                {/*<DropdownButton as={ButtonGroup} title="Offered Blocks">*/}
                                {/* <Dropdown.Item as="div" style={{padding: "0 !important"}}> */}
                                <ToggleButtonGroup type="checkbox" vertical
                                    value={this.state.course.offeredBlocks}
                                    style={{ width: "100%" }}
                                    onChange={(value, event) => {
                                        /* console.log(index);
                                        console.log(appInstance.state.courses[0]);
                                        console.log(value); */

                                        CoursesStore.updateCourse(index, {
                                            offeredBlocks: value
                                        });

                                        /* const newCourses = appInstance.state.courses.slice();
                                        newCourses[index].offeredBlocks = value;

                                        appInstance.setState({
                                            courses: newCourses
                                        }); */
                                    }}
                                >
                                    {
                                        (new Array(this.state.blocks).fill(null)).map((_, index2) =>

                                            <ToggleButton key={index2} value={index2} style={{ width: "100%" }}>Block {index2 + 1}</ToggleButton>
                                        )
                                    }
                                </ToggleButtonGroup>
                                {/* </Dropdown.Item> */}
                            </Dropdown.Menu>
                        </Dropdown>
                        {/* </DropdownButton> */}
                    </ButtonGroup>
                    <ButtonGroup style={{ paddingBottom: "5px"}}>
                        <Button className="courseListButton" onClick={() => this.addCourse(index, appInstance)}>+</Button>
                        <Button className="courseListButton"
                                onClick={() => CoursesStore.getCourses().length < 2 ? CoursesStore.updateCourse(index, {name: "", teacher: "", offeredBlocks: []}) :
                                this.removeCourse(index, appInstance)}
                        >-
                        </Button>
                    </ButtonGroup>
                    </div>
                {/* </form> */}
            </ListGroup.Item>
        )
    }
}

ReactDOM.render(
    <ScheduleApp />,
    document.getElementById("root")
);

//register service worker
serviceWorker.register();