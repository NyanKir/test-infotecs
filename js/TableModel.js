import EventEmitter from "./EventEmitter.js";

export default class TableModel extends EventEmitter{
    constructor(table) {
        super()
        this.table=table
    }

    getTable(){
        return this.table
    }
}