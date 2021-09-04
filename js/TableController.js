export default class TableController{
    constructor(model, view) {
        this.model=model;
        this.view=view;

        this.view.subscribe('changeCurrentPage',(page)=>this.changeCurrentPage(page))
        this.view.subscribe('selectRow',(event,id)=>this.selectRow(event,id))
        this.view.subscribe('sortColumn',(event)=>this.sortColumn(event))
    }
    sortColumn(event) {
        this.model.sortColumn(event)
    }
    selectRow(id){
        console.log(id)
    }

    changeCurrentPage(page){
        if(page !== this.model.currentPage){
            this.model.changeCurrentPage(page)
        }
    }
}