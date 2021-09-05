import EventEmitter from "./EventEmitter.js";

export default class TableView extends EventEmitter {
    constructor(model, tableRef, editRef) {
        super()
        this.model = model
        this.tableRef = tableRef
        this.editRef = editRef

        this.model.subscribe('render', () => this.render())
        this.model.subscribe('editPanel', () => this.editPanel())
    }

    editPanel() {
        this.editRef.innerHTML = ''
        this.model.headers.forEach((head) => {
            const label = document.createElement('label')
            let input;

            label.innerHTML = `<span>${head.name}</span>`
            label.classList.add('edit-area__label')
            if (head.path === 'about') {
                input = document.createElement('textarea')
                input.classList.add('edit-area__textarea')
            } else {
                if (head.path === 'eyeColor') {
                    input = document.createElement('input')
                    input.type = 'color'
                    input.setAttribute('value', this.model.pickedRow[head.path])
                } else {
                    input = document.createElement('input')
                    input.classList.add('edit-area__input')
                }


            }
            if (head.include) {
                input.value = this.model.pickedRow['name'][head.include]
            } else {
                input.value = this.model.pickedRow[head.path]
            }

            label.appendChild(input)
            this.editRef.appendChild(label)

        })

        const btn = document.createElement('button')
        btn.textContent = "Изменить"
        btn.classList.add('btn')
        // btn.addEventListener('click')
        this.editRef.appendChild(btn)
    }

    clear() {
        this.tableRef.innerText = ''
        document.getElementById('pagination')?.remove()
        document.getElementById('panel')?.remove()
    }

    renderFilterPanel() {
        const div = document.createElement('div')
        div.classList.add('panel')
        div.id = 'panel'
        this.model.headers.forEach((head) => {
            const input = document.createElement('input')
            const label = document.createElement('label')
            input.type = 'checkbox'
            label.textContent = head.name

            if (head.include) {
                input.value = head.include
            } else {
                input.value = head.path
            }

            input.checked = head.show

            input.addEventListener("change", (e) => this.emit("columnHandler", e.target))
            label.appendChild(input)
            div.appendChild(label)
        })
        this.tableRef.before(div)
    }

    renderPagination() {
        const wrapper = document.createElement('div')
        wrapper.innerText = ''
        wrapper.classList.add('pagination')
        wrapper.id = 'pagination'

        for (let i = 0; i < this.model.countPages; i++) {
            const btn = document.createElement('button')

            if (i + 1 == this.model.currentPage) {
                btn.classList.add('pagination__btn_current')
            }

            btn.setAttribute('data-page', i + 1)
            btn.addEventListener('click', (e) => this.emit('changeCurrentPage', e.target.dataset.page))
            btn.textContent = i + 1
            btn.classList.add('pagination__btn')
            wrapper.appendChild(btn)
        }

        this.tableRef.after(wrapper)
    }

    renderHeader() {
        const newRow = this.tableRef.insertRow(-1);
        newRow.classList.add('table__tr')

        this.model.headers.reduce((acc, el, index) => {
            if (!el.show) {
                return acc;
            }
            const newCell = newRow.insertCell(acc);
            newCell.classList.add('table__th');
            newCell.addEventListener('dblclick', (e) => {
                this.emit('sortColumn', e)
            })
            newCell.addEventListener('contextmenu', (ev) => {
                ev.preventDefault();
                this.emit("clearHeaderSort")
                return false;
            });
            if (el.sort !== undefined) {
                newCell.classList.add(el.sort ? 'arrow-top' : 'arrow-bottom')
            }

            if (el.include) {
                newCell.setAttribute('data-column', el.include)
                newCell.setAttribute('data-include', true)
            } else {
                newCell.setAttribute('data-column', el.path)
            }
            const newText = document.createTextNode(el.name);
            newCell.setAttribute('title', el.name)
            newCell.appendChild(newText);
            return acc + 1;
        }, 0)
    }

    render() {
        this.clear()
        this.renderFilterPanel()
        if (this.model.wholeColumnsHidden) {
            return
        }
        this.renderHeader()
        this.renderPagination()

        this.model.currentTableData.forEach((el) => {
            const newRow = this.tableRef.insertRow(-1);
            newRow.classList.add('table__tr')
            newRow.setAttribute('data-id', el.id)
            newRow.addEventListener('click', (e) => this.emit('selectRow', e.target.parentElement.dataset.id))

            this.model.headers.reduce((acc, head, index) => {
                if (!head.show) {
                    return acc;
                }

                let newText;
                const newCell = newRow.insertCell(acc);
                newCell.classList.add('table__td');


                if (head.path === 'about') {
                    newCell.classList.add('table__td_truncate')
                }

                if (head.path === 'eyeColor') {
                    newText = document.createElement('div')
                    newText.classList.add('table__td_color')
                    newText.setAttribute('style', `background-color:${el[head.path]};`)
                    newText.setAttribute('title', el[head.path])
                }

                if (head.include) {
                    newText = document.createTextNode(el.name[head.include]);
                } else if (head.path !== 'eyeColor') {
                    newText = document.createTextNode(el[head.path]);
                }
                newCell.appendChild(newText);
                return acc + 1;

            }, 0)
        })

    }
}