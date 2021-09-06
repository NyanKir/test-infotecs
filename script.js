import TableView from "./js/TableView.js";
import TableController from "./js/TableController.js";
import TableModel from "./js/TableModel.js";

document.addEventListener('DOMContentLoaded', async function () {
    const wrapper=document.getElementById('wrapper')
    const wrapperTable=document.createElement('div')
    const wrapperEdit=document.createElement('div')
    wrapperTable.classList.add('wrapper__table')
    wrapperEdit.classList.add('wrapper__edit')

    const table=document.createElement('table')
    const editArea=document.createElement('div')


    table.classList.add('table')
    editArea.classList.add('edit-area')
    table.id='table'
    editArea.id='editArea'
    wrapper.appendChild(wrapperTable)
    wrapper.appendChild(wrapperEdit)
    wrapperTable.appendChild(table)
    wrapperEdit.appendChild(editArea)
    alert('Инструкция\n' +
        'Чтобы отсортировать по возрастанию или по убыванию нажмите дважды по заголовку колонны, чтобы убрать сортировку нажмите правой кнопкой.')
    const response = await fetch('./data.json', {method: 'get'})
    const data = await response.json()
    const model = new TableModel(JSON.parse(data))
    const view = new TableView(model, table, editArea)
    new TableController(model, view)
    view.render()
})
