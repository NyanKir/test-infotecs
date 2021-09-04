import TableView from "./js/TableView.js";
import TableController from "./js/TableController.js";
import TableModel from "./js/TableModel.js";

document.addEventListener('DOMContentLoaded', async function () {
    const wrapper=document.getElementById('wrapper')
    const table=document.createElement('table')
    table.classList.add('table')
    table.id='table'
    wrapper.appendChild(table)

    const response = await fetch('./data.json', {method: 'get'})
    const data = await response.json()
    const model = new TableModel(data)
    const view = new TableView(model, table)
    new TableController(model, view)
    view.render()
})
