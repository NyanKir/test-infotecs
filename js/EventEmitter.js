export default class EventEmitter {
    constructor() {
        this.evets={}
    }

    subscribe(eventName,fn){
        if(!this.evets[eventName]){
            this.evets[eventName]=[]
        }
        this.evets[eventName].push(fn)

        return ()=>{
            this.evets[eventName]=this.evets[eventName].filter(eventFn=> fn !== eventFn)
        }
    }

    emit(eventName,data){
        const event=this.evets[eventName]
        if(event){
            event.forEach((fn)=>{
                fn.call(null,data)
            })
        }
    }
}