import React from "react";
import ReactDOM from "react-dom";

//import Table from "react-bootstrap/Table";

//Import react-table
import ReactTable from "react-table";
import "react-table/react-table.css"

//react-fixed-hoc-tables
import withFixedColumns from "react-table-hoc-fixed-columns";
import "react-table-hoc-fixed-columns/lib/styles.css"


import "./index.css";
import "./schedule.js";

const ReactTableFixedColumns = withFixedColumns(ReactTable);



class ScheduleApp extends React.Component {
    constructor(props) {
        super(props);

        //to change
        this.state = { schedules: global.schedules };
    }

    render() {
        return (
            <ScheduleDisplay schedules={this.state.schedules} />
        )
    }
}



function ScheduleRow(props) {
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
}

class ScheduleDisplay extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        //let headerArray = [];

        //create table headers
        /* for (let i = 0; i < global.numOfBlocks; ++i) {
            headerArray.push(
                <div>{i}</div>
            );
        } */

        let tableHeaderArray = new Array(global.numOfBlocks).fill(null);
        //create table headers
        for (let i = 0; i < global.numOfBlocks; ++i) {
            tableHeaderArray.push(
                <tr>
                    <th class="header">{i}</th>
                    <ScheduleRow block={i} />
                </tr>
            );
        }


        /* let tempColumns = [];
        for (let i = 1; i < global.numOfBlocks; ++i) {
            //add column header for each block
            tempColumns.push({
                id: "block" + i,
                Header: "",
                accessor: d => d[i]
            });
        } */

        function processData(data) {
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
        }



        const data = this.props.schedules;

        let columns = [];
        for (let i = 0; i < global.numOfBlocks; ++i) {
            columns.push(
                {
                Header: "Block " + i,
                id: "block" + i,
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


        return (
            /* <ReactTableFixedColumns
                data={data} 
                columns={columns} 
                resolveData={processData} 
                className="-striped -highlight"
                defaultSorted={[
                    {
                        id: "header",
                        desc: false
                    }
                ]}
            /> */

            <ReactTable
                data={data} 
                columns={columns} 
                className="-striped -highlight"
                defaultSorted={[
                    {
                        id: "header",
                        desc: false
                    }
                ]}  
            />
        )


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
    
}

ReactDOM.render(
    <ScheduleApp />,
    document.getElementById("root")
);