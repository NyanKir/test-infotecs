import EventEmitter from "./EventEmitter.js";

export default class TableView extends EventEmitter{
    constructor(model,tableRef) {
        super()
        this.model=model
        this.tableRef=tableRef

        this.model.subscribe('render',()=>this.render())
    }

    clear(){
        this.tableRef.innerText=''
        document.getElementById('pagination')?.remove()
        document.getElementById('panel')?.remove()
    }
    renderFilterPanel(){
        const div = document.createElement('div')
        div.classList.add('panel')
        div.id='panel'
        div.textContent='Panel'
        // const span=document.createElement('span')
        // span.classList.add('anchor')
        // span.textContent='Скрыть/Показать колонны'
        // const ul=document.createElement('ul')
        // ul.classList.add('list')
        // this.model.headers.forEach((el)=>{
        //     const li=document.createElement('li')
        //     const input = document.createElement('input')
        //     input.type='checkbox'
        //     li.classList.add('list__item')
        //     li.textContent=el.name
        //     li.appendChild(input)
        //     ul.appendChild(li)
        // })
        // div.appendChild(span)
        // div.appendChild(ul)
        //
        // div.getElementsByClassName('anchor')[0].onclick = function(evt) {
        //     if (div.classList.contains('visible'))
        //         div.classList.remove('visible');
        //     else
        //         div.classList.add('visible');
        // }
        this.tableRef.before(div)
    }

    renderPagination(){
        const wrapper=document.createElement('div')
        wrapper.innerText=''
        wrapper.classList.add('pagination')
        wrapper.id='pagination'

        for(let i=0;i<this.model.countPages;i++){
            const btn=document.createElement('button')

            if(i+1==this.model.currentPage){
                btn.classList.add('pagination__btn_current')
            }

            btn.setAttribute('data-page',i+1)
            btn.addEventListener('click', (e)=> this.emit('changeCurrentPage',e.target.dataset.page))
            btn.textContent=i+1
            btn.classList.add('pagination__btn')
            wrapper.appendChild(btn)
        }

        this.tableRef.after(wrapper)
    }

    renderHeader(){
        const newRow = this.tableRef.insertRow(-1);
        newRow.classList.add('table__tr')

        this.model.headers.forEach((el, index) => {
            const newCell = newRow.insertCell(index);
            newCell.classList.add('table__th');
            newCell.addEventListener('dblclick',(e)=>{
                this.emit('sortColumn',e)
            })
            if(el.sort !== undefined){
                newCell.classList.add(el.sort?'arrow-top':'arrow-bottom')
            }

            if(el.include){
                newCell.setAttribute('data-column',el.include)
                newCell.setAttribute('data-include',true)
            }else{
                newCell.setAttribute('data-column',el.path)
            }
            const newText = document.createTextNode(el.name);
            newCell.setAttribute('title', el.name)
            newCell.appendChild(newText);
        })
    }

    render(){
        this.clear()
        this.renderHeader()
        this.renderPagination()
        this.renderFilterPanel()

        this.model.currentTableData.forEach((el) => {
            const newRow = this.tableRef.insertRow(-1);
            newRow.classList.add('table__tr')
            newRow.setAttribute('data-id',el.id)
            newRow.addEventListener('click',(e)=>this.emit('selectRow',e.target.parentElement.dataset.id))

            this.model.headers.forEach((head, index) => {
                let newText;
                const newCell = newRow.insertCell(index);
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
            })
        })

    }
}