class Class {
    constructor(name = "", teacher = "", offeredBlocks = [], id) {
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

    clone() {
        return new Class(this.name, this.teacher, this.offeredBlocks, this.id);
    }
}

module.exports = Class;