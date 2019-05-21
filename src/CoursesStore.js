let EventEmitter = require("events").EventEmitter;

let emitter = new EventEmitter();

const Class = require("./class.js");

let ids = 0;

//should be 8
let blocks = 4;

let courses = [new Class("", "", [], ids++)];

//Test Schedule:
courses = [
    new Class("A", "A", [0, 3], ids++),
    new Class("B", "B", [0, 2, 3], ids++),
    new Class("C", "C", [0, 1], ids++),
    new Class("D", "D", [2, 3], ids++)
];





module.exports = {
    getCourses: function() {
        //objects inside are same.
        //Don't modify them outside
        return courses.slice();
    },
    subscribeUpdate: function(callback) {
        emitter.addListener("update", callback);
    },
    unsubscribeUpdate: function(callback) {
        emitter.removeListener("update", callback);
    },
    updateCourse: function(index, newValues) {
        for (const prop in newValues) {
            courses[index][prop] = newValues[prop];
        }

        emitter.emit("update");
    },
    subscribeAddRemove: function(callback) {
        emitter.addListener("addRemove", callback);
    },
    unsubscribeAddRemove: function(callback) {
        emitter.removeListener("addRemove", callback);
    },
    addCourse: function(index) {
        courses = courses.slice(0, index + 1).concat(new Class("", "", [], ids++), courses.slice(index + 1, courses.length));
        emitter.emit("addRemove");
    },
    removeCourse: function(index) {
        let coursesCopy = courses.slice();
        coursesCopy.splice(index, 1);
        courses = coursesCopy;
        emitter.emit("addRemove");
    },
    subscribeBlocksChange: function(callback) {
        emitter.addListener("blocksChange", callback);
    },
    unsubscribeBlocksChange: function(callback) {
        emitter.removeListener("blocksChange", callback);
    },
    getBlocks: function() {
        return blocks;
    },
    changeBlocks: function(newBlocks) {
        if (newBlocks !== blocks) {
            blocks = newBlocks;
            emitter.emit("blocksChange");
        }
    }

}