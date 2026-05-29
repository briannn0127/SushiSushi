const { ccclass, property } = cc._decorator;

@ccclass
export default class InteractionPromptView extends cc.Component {
    @property(cc.Label)
    public promptLabel: cc.Label = null;

    private warnedMissingLabel: boolean = false;

    onLoad(): void {
        this.hide();
    }

    public showPrompt(prompt: string): void {
        if (!prompt) {
            this.hide();
            return;
        }

        this.node.active = true;
        if (!this.promptLabel) {
            if (!this.warnedMissingLabel) {
                this.warnedMissingLabel = true;
                cc.warn("InteractionPromptView.promptLabel is not assigned.");
            }
            return;
        }

        this.promptLabel.string = prompt;
        // TODO: Add fade in / scale pop animation.
    }

    public hide(): void {
        this.node.active = false;
    }
}
