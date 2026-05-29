const { ccclass, property } = cc._decorator;

export class PauseMenuEvents {
    public static readonly RESUME_CLICKED: string = "ui-resume-clicked";
    public static readonly RESTART_DAY_CLICKED: string = "ui-restart-day-clicked";
    public static readonly MAIN_MENU_CLICKED: string = "ui-main-menu-clicked";
    public static readonly SETTINGS_CLICKED: string = "ui-settings-clicked";
}

@ccclass
export default class PauseMenuView extends cc.Component {
    @property(cc.Button)
    public resumeButton: cc.Button = null;

    @property(cc.Button)
    public restartDayButton: cc.Button = null;

    @property(cc.Button)
    public mainMenuButton: cc.Button = null;

    @property(cc.Button)
    public settingsButton: cc.Button = null;

    private buttonsBound: boolean = false;

    onLoad(): void {
        this.bindButtons();
        this.hide();
    }

    onDestroy(): void {
        this.unbindButtons();
    }

    public show(): void {
        this.bindButtons();
        this.node.active = true;
        // TODO: Add fade in / scale pop animation.
    }

    public hide(): void {
        this.node.active = false;
    }

    public onResumeClicked(): void {
        cc.log("PauseMenu Resume clicked.");
        cc.systemEvent.emit(PauseMenuEvents.RESUME_CLICKED);
    }

    public onRestartDayClicked(): void {
        cc.log("PauseMenu Restart Day clicked.");
        cc.systemEvent.emit(PauseMenuEvents.RESTART_DAY_CLICKED);
    }

    public onMainMenuClicked(): void {
        cc.log("PauseMenu Main Menu clicked.");
        cc.systemEvent.emit(PauseMenuEvents.MAIN_MENU_CLICKED);
    }

    public onSettingsClicked(): void {
        cc.log("PauseMenu Settings clicked.");
        cc.systemEvent.emit(PauseMenuEvents.SETTINGS_CLICKED);
    }

    private bindButtons(): void {
        if (this.buttonsBound) {
            this.unbindButtons();
        }

        if (this.resumeButton) {
            this.resumeButton.node.on("click", this.onResumeClicked, this);
        }

        if (this.restartDayButton) {
            this.restartDayButton.node.on("click", this.onRestartDayClicked, this);
        }

        if (this.mainMenuButton) {
            this.mainMenuButton.node.on("click", this.onMainMenuClicked, this);
        }

        if (this.settingsButton) {
            this.settingsButton.node.on("click", this.onSettingsClicked, this);
        }

        this.buttonsBound = true;
    }

    private unbindButtons(): void {
        if (!this.buttonsBound) {
            return;
        }

        if (this.resumeButton) {
            this.resumeButton.node.off("click", this.onResumeClicked, this);
        }

        if (this.restartDayButton) {
            this.restartDayButton.node.off("click", this.onRestartDayClicked, this);
        }

        if (this.mainMenuButton) {
            this.mainMenuButton.node.off("click", this.onMainMenuClicked, this);
        }

        if (this.settingsButton) {
            this.settingsButton.node.off("click", this.onSettingsClicked, this);
        }

        this.buttonsBound = false;
    }
}
