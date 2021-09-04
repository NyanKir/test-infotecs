import EventEmitter from "./EventEmitter.js";

export default class TableModel extends EventEmitter {
    constructor(table) {
        super()
        this.table = table
        this.maxCountOnPage = 10
        this.countPages = Math.ceil(this.table.length/this.maxCountOnPage)
        this.currentPage=1
        this.headers = [
            {name: 'Имя', include: 'firstName'},
            {name: 'Фамилия', include: 'lastName'},
            {name: 'Обо мне', path: 'about'},
            {name: 'Цвет глаз', path: 'eyeColor'}
        ]
        this.currentTableData=undefined
        this.calculateCurrentTableData()
    }

    calculateCurrentTableData(){
         this.currentTableData=this.table.slice((this.currentPage - 1) * this.maxCountOnPage, this.currentPage * this.maxCountOnPage)
    }

    changeCurrentPage(page){
        this.currentPage=page
        this.calculateCurrentTableData()
        this.emit('render')
    }

    sortColumn(event){
        if(this.currentColumn === undefined){
            this.currentColumn=event
        }
        const include=event.target.dataset.include
        const columnName=event.target.dataset.column
        if(include){
            this.headers.forEach((el)=>{
                if(el.include===columnName){
                    el.sort=!el.sort
                    this.currentTableData=this.currentTableData.sort((a,b)=>{
                        if ( a["name"][columnName] < b["name"][columnName] ){
                            return el.sort?-1:1;
                        }
                        if ( a["name"][columnName] > b["name"][columnName] ){
                            return el.sort?1:-1;
                        }
                        return 0;
                    })
                    return
                }
                if(el.sort!==undefined){
                    delete  el.sort
                }

            })


        }else{
            this.headers.forEach((el)=>{

                if(el.path===columnName){
                    el.sort=!el.sort

                    this.currentTableData=this.currentTableData.sort((a,b)=>{
                        if ( a[columnName] < b[columnName] ){
                            return el.sort?-1:1;
                        }
                        if ( a[columnName] > b[columnName] ){
                            return el.sort?1:-1;
                        }
                        return 0;
                    })
                    return
                }
                if(el.sort!==undefined){
                    delete  el.sort
                }

            })



        }

        this.emit('render')
    }

}