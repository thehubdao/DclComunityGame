import { CurrencyManager } from "./currencyManager";
import { PermanentUpgradeManager } from "./permanent_upgrade_manager";

export class UiManager{

    private static _goldText?: UIText = undefined;
    private static _diamondText?: UIText = undefined;


    public static initializeUI() {
        // Create screenspace component
        const canvas = new UICanvas()

        // Create a textShape component, setting the canvas as parent
        this._goldText = new UIText(canvas)
        this._goldText.value = "420 Gold"
        this._goldText.fontSize = 69
        this._goldText.hAlign = "right"
        this._goldText.vAlign = "top"
        this._goldText.positionX = -20
        this._goldText.positionY = -20
        this._goldText.hTextAlign = "right"
        this._goldText.vTextAlign = "bottom"

        // Create a textShape component, setting the canvas as parent
        this._diamondText = new UIText(canvas)
        this._diamondText.value = "420 Diamond"
        this._diamondText.fontSize = 69
        this._diamondText.hAlign = "right"
        this._diamondText.vAlign = "top"
        this._diamondText.positionX = -20
        this._diamondText.positionY = -80
        this._diamondText.hTextAlign = "right"
        this._diamondText.vTextAlign = "bottom"

        this.updateUi()
        CurrencyManager.instance.onChangedEvent.callbacks.push(()=>{this.updateUi()})
        PermanentUpgradeManager.onDiamondsChanged.callbacks.push(()=>{this.updateUi()})
    }

    private static updateUi() {
        if(this._goldText)
            this._goldText.value = CurrencyManager.instance.gold + " Gold"
        if(this._diamondText)
            this._diamondText.value = PermanentUpgradeManager.diamonds + " Diamonds"
    }
}