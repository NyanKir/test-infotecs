const tableRef = document.getElementById('table')
const headers = [
    {name: 'Имя', include: 'firstName'},
    {name: 'Фамилия', include: 'lastName'},
    {name: 'Обо мне', path: 'about'},
    {name: 'Цвет глаз', path: 'eyeColor'}
]


document.addEventListener('DOMContentLoaded', function () {
    renderHeader()
    fetchData(1)
})

function renderHeader() {
    const newRow = tableRef.insertRow(-1);
    newRow.classList.add('table__tr')

    headers.forEach((el, index) => {
        const newCell = newRow.insertCell(index);
        newCell.classList.add('table__th');
        const newText = document.createTextNode(el.name);
        newCell.setAttribute('title',el.name)
        newCell.appendChild(newText);
    })
}

function renderTable(data) {
    data.forEach((el)=>{
        const newRow = tableRef.insertRow(-1);
        newRow.classList.add('table__tr')

        headers.forEach((head, index) => {
            let newText;
            const newCell = newRow.insertCell(index);
            newCell.classList.add('table__td');

            if(head.path==='about'){
                newCell.classList.add('table__td_truncate')
            }


            if(head.path==='eyeColor'){
                newText=document.createElement('div')
                newText.classList.add('table__td_color')
                newText.setAttribute('style',`background-color:${el[head.path]};`)
                newText.setAttribute('title',el[head.path])
            }

            if(head.include){
                newText = document.createTextNode(el.name[head.include]);
            }else{
                if(head.path!=='eyeColor'){
                    newText = document.createTextNode(el[head.path]);
                }
            }
            newCell.appendChild(newText);
        })
    })
}

function fetchData(page) {
    const paginate = (array, pageSize, pageNumber) => {
        return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
    }

    fetch('./data.json', {
        method: 'get'
    })
        .then(res => res.json())
        .then(data => renderTable(paginate(data, 10, page)))
        .catch(error => console.log(error))
}