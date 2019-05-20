// class Class {
//   //availableBlocks
//   //array of the block numbers the class is available.
//   constructor(name, teacher, offeredBlocks) {
//     this.name = name;
//     this.teacher = teacher;
//     this.offeredBlocks = offeredBlocks;

//     //add self to class schedules
//     for (const block of offeredBlocks) {
//       classTimes[block - 1].push(this);
//     }
//   }
// }

let Class = function (name = "", teacher = "", offeredBlocks = [], id) {
    this.name = name;
    this.teacher = teacher;
    this.offeredBlocks = offeredBlocks;
    this.id = id;
    this.possibleBlocks = [];

    //add self to class schedules
    /* for (const block of offeredBlocks) {
        classTimes[block - 1].push(this);
    } */
}

let classes = [
    {
        name: "A",
        offeredBlocks: [1, 3, 4],
        possibleBlocks: []
    },
    {
        name: "B",
        offeredBlocks: [2, 3],
        possibleBlocks: []
    },
    {
        name: "C",
        offeredBlocks: [1, 4],
        possibleBlocks: []
    },
    {
        name: "D",
        offeredBlocks: [3],
        possibleBlocks: []
    }
];

//number of blocks in your schedule
let numOfBlocks = 4;

//array holding makeSchedule each block and the classes in each block
let classTimes = [];

//blocks that a class must go in.
//the class has only one available block
let reservedBlocks = [];



function prepareSchedule() {
    classTimes.length = numOfBlocks;
    //doesn't work. Fills classTime with a reference to the same array
    //classTimes.fill(new Array());

    //need to manually fill it
    for (let i = 0; i < numOfBlocks; ++i) {
        classTimes[i] = [];
    }

    for (let c of classes) {
        if (c.offeredBlocks.length < 2) {
            //Two classes only available at same time
            if (reservedBlocks.includes(c.offeredBlocks[0])) {
                console.log("No possible schedule");
                break;
            }

            let block = c.offeredBlocks[0];
            reservedBlocks.push(block);
            c.possibleBlocks.push(block);
        }

        for (let block of c.offeredBlocks) {
            if (!reservedBlocks.includes(block)) {
                c.possibleBlocks.push(block);
            }
        }
    }
}

/**
 * Returns a nested array.
 * Each array inside is a schedule
 * Each nested array holds a class object in the order of the schedule. Index 0 is the 1st block class, etc. 
 */


function makeSchedules(blocksPossibleClasses, currSchedule = []) {

    let possibleSchedules = [];



    //if only one block in blocksArray, then have reached end of recursion. Return values.
    if (blocksPossibleClasses.length < 2) {
        return blocksPossibleClasses;
    }
    else {
        for (let aClass of blocksPossibleClasses[0]) {

            //nested array of removals from each block in blocksPossibleClasses
            let removals = [];
            removals.length = blocksPossibleClasses.length;
            for (let i = 0, n = blocksPossibleClasses.length; i < n; ++i) {
                removals[i] = [];
            }

            let classPossibleSchedules = [];

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
            let partialPossibleSchedules = makeSchedules(blocksPossibleClasses.slice(1));

            //iterate through the returned possible schedules
            for (let partialSchedule of partialPossibleSchedules) {
                possibleSchedules.push([aClass].concat(partialSchedule));
            }

            for (const [i, el] of removals.entries()) {

                //need to modify original blocksPossibleClasses

                //blocksPossibleClasses[i] = blocksPossibleClasses[i].concat(el);
                blocksPossibleClasses[i].push(...el);
            }

            removals = [];

            //possibleSchedules.push(makeSchedules(blocksPossibleClasses.slice(1), currSchedule.push(block)));
        }
        return possibleSchedules;
    }

}


//remove later

prepareSchedule();

let classA = new Class("A", "Me", [1, 4]);
let classB = new Class("B", "Me", [1, 3, 4]);
let classC = new Class("C", "Me", [2]);
let classD = new Class("D", "Me", [3, 4]);

let testSchedule = [
    [classA, classB],       //block 1
    [classC],            //block 2
    [classB, classD],       //block 3
    [classA, classB, classD]   //block 4
];



var schedules = makeSchedules(testSchedule);
//console.log(schedules);
global.numOfBlocks = numOfBlocks;
global.schedules = schedules;

export default Class;