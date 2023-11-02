import { Event } from "./events";

export class CurrencyManager {
    public static instance = new CurrencyManager;

    public onChangedEvent: Event = new Event();

    private initialGold: number = 100
    private gold_internal: number = this.initialGold;

    public get gold(): number {
        return this.gold_internal;
    }

    public set gold(v: number) {
        this.gold_internal = v;

        this.onChangedEvent.fire();
    }

    public resetGold(){
        this.gold = this.initialGold
    }
}