import EventEmitter from "./EventEmitter.js";

export default class TableModel extends EventEmitter {
    constructor(table) {
        super()
        this.table = table
        this.maxCountOnPage = 10
        this.countPages = Math.ceil(this.table.length/this.maxCountOnPage)
        this.currentPage=1
        this.headers = [
            {name: 'Имя', include: 'firstName',show:true},
            {name: 'Фамилия', include: 'lastName',show:true},
            {name: 'Обо мне', path: 'about',show:true},
            {name: 'Цвет глаз', path: 'eyeColor',show:true}
        ]
        this.wholeColumnsHidden=false;
        this.currentTableData=undefined
        this.pickedRow=undefined
        this.calculateCurrentTableData()
    }

    calculateCurrentTableData(){
         this.currentTableData=this.table.slice((this.currentPage - 1) * this.maxCountOnPage, this.currentPage * this.maxCountOnPage)
         this.headers.forEach((el)=>{
            if(el.sort !==undefined ){
                if(el.include){

                    this.currentTableData=this.currentTableData.sort((a,b)=>{
                        if ( a["name"][el.include] < b["name"][el.include] ){
                            return el.sort?-1:1;
                        }
                        if ( a["name"][el.include] > b["name"][el.include] ){
                            return el.sort?1:-1;
                        }
                        return 0;
                    })
                    return
                }
                this.currentTableData=this.currentTableData.sort((a,b)=>{
                    if ( a[el.path] < b[el.path] ){
                        return el.sort?-1:1;
                    }
                    if ( a[el.path] > b[el.path] ){
                        return el.sort?1:-1;
                    }
                    return 0;
                })
            }
        })

    }

    changeCurrentPage(page){
        this.currentPage=page
        this.calculateCurrentTableData()
        this.emit('render')
    }

    sortColumn(event){
        const columnName=event.target.dataset.column

        this.headers.forEach((el)=>{

            if(el.include===columnName){
                el.sort=!el.sort
                return
            }
            if(el.path===columnName){
                el.sort=!el.sort
                return
            }

            if(el.sort!==undefined){
                delete  el.sort
            }
        })

        this.calculateCurrentTableData()
        this.emit('render')
    }

    clearHeaderSort(){
        this.headers.forEach((el)=>{
            delete el.sort
        })
        this.calculateCurrentTableData()
        this.emit('render')
    }

    columnHandler(target){

        this.headers.forEach((head)=>{
            if(head.include === target.value || head.path === target.value){
                head.show=target.checked
            }
        })

        this.wholeColumnsHidden=!this.headers.some((el)=>{
            return el.show
        })
        this.calculateCurrentTableData()
        this.emit('render')
    }

    selectRow(id){
        this.currentTableData.forEach((el)=>{
            if(id=== el.id){
                this.pickedRow=el
            }
        })
        this.emit('editPanel')
    }
    changeData(data){
        console.log(data)
    }
}