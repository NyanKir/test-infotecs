export default class TableController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.subscribe('changeCurrentPage', (page) => this.changeCurrentPage(page))
        this.view.subscribe('selectRow', (event, id) => this.selectRow(event, id))
        this.view.subscribe('sortColumn', (event) => this.sortColumn(event))
        this.view.subscribe('clearHeaderSort', () => this.clearHeaderSort())
        this.view.subscribe('columnHandler', (target) => this.columnHandler(target))
        this.view.subscribe('changeData', (newData) => this.changeData(newData))
    }

    sortColumn(event) {
        this.model.sortColumn(event)
    }

    clearHeaderSort() {
        this.model.clearHeaderSort()
    }

    columnHandler(target) {
        this.model.columnHandler(target)
    }

    selectRow(id) {
        this.model.selectRow(id)
    }

    changeData(newData) {
        this.model.changeData(newData)
    }

    changeCurrentPage(page) {
        if (page !== this.model.currentPage) {
            this.model.changeCurrentPage(page)
        }
    }
}