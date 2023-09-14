export class CurrencyManager {
    public static instance = new CurrencyManager;

    private initialGold: number = 100
    private gold_internal: number = this.initialGold;

    private uiText?: UIText = undefined;


    public get gold(): number {
        return this.gold_internal;
    }

    public set gold(v: number) {
        this.gold_internal = v;

        this.updateUi()
    }

    public resetGold(){
        this.gold = this.initialGold
    }

    private updateUi() {
        if(this.uiText)
            this.uiText.value = this.gold + " Gold"
    }

    /**
     * initializeUI
     */
    public initializeUI() {
        // Create screenspace component
        const canvas = new UICanvas()

        // Create a textShape component, setting the canvas as parent
        this.uiText = new UIText(canvas)
        this.uiText.value = "420 Gold"
        this.uiText.fontSize = 69
        this.uiText.hAlign = "right"
        this.uiText.vAlign = "top"
        this.uiText.positionX = -20
        this.uiText.positionY = -40
        this.uiText.hTextAlign = "right"
        this.uiText.vTextAlign = "bottom"

        this.updateUi()
    }
}