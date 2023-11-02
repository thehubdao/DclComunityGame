export class TypedEvent<T>{
    public callbacks: ((value:T)=>void)[] = [];

    public fire(value:T){
        for (const callback of this.callbacks) {
            callback(value);
        }
    }
}

export class Event extends TypedEvent<void>{
    
}
