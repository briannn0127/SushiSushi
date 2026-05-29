const { ccclass, property } = cc._decorator;

import EconomyManager from "../economy/EconomyManager";
import IngredientBox from "../interaction/IngredientBox";
import InteractionSystem from "../interaction/InteractionSystem";
import OrderManager from "../order/OrderManager";
import PlayerController from "../player/PlayerController";
import PlayerHand from "../player/PlayerHand";
import HUDView from "../ui/HUDView";
import InteractionPromptView from "../ui/InteractionPromptView";
import OrderListView from "../ui/OrderListView";
import PauseMenuView from "../ui/PauseMenuView";
import UIManager from "../ui/UIManager";
import Workstation from "../workstation/Workstation";
import GameManager from "./GameManager";
import InputManager from "./InputManager";
import TimeManager from "./TimeManager";
import PlayerManager from "../player/PlayerManager";

@ccclass
export default class MainSceneInitializer extends cc.Component {
    @property
    public autoBuildOnLoad: boolean = true;

    @property
    public canvasWidth: number = 1280;

    @property
    public canvasHeight: number = 720;

    onLoad(): void {
        if (this.autoBuildOnLoad) {
            this.buildSceneIfNeeded();
        }
    }

    public buildSceneIfNeeded(): void {
        var canvas = this.getOrCreateCanvas();
        var mainCamera = this.getOrCreateCamera(canvas);
        var gameRoot = this.getOrCreateChild(canvas, "GameRoot", cc.v2(0, 0), cc.size(this.canvasWidth, this.canvasHeight));
        this.getOrCreateShopFloor(gameRoot);
        var managers = this.getOrCreateChild(gameRoot, "Managers", cc.v2(0, 0), cc.size(10, 10));
        var workstations = this.getOrCreateChild(gameRoot, "Workstations", cc.v2(0, 0), cc.size(this.canvasWidth, this.canvasHeight));
        var ingredientBoxes = this.getOrCreateChild(gameRoot, "IngredientBoxes", cc.v2(0, 0), cc.size(this.canvasWidth, this.canvasHeight));
        var uiRoot = this.getOrCreateChild(canvas, "UIRoot", cc.v2(0, 0), cc.size(this.canvasWidth, this.canvasHeight));
        var player = this.getOrCreatePlayer(gameRoot);

        var inputManager = this.getOrAdd(managers, InputManager);
        var timeManager = this.getOrAdd(managers, TimeManager);
        var orderManager = this.getOrAdd(managers, OrderManager);
        var economyManager = this.getOrAdd(managers, EconomyManager);
        var playerManager = this.getOrAdd(managers, PlayerManager);
        var gameManager = this.getOrAdd(managers, GameManager);
        var uiManager = this.getOrAdd(managers, UIManager);

        var playerHand = this.getOrAdd(player, PlayerHand);
        var interactionSystem = this.getOrAdd(player, InteractionSystem);
        var playerController = this.getOrAdd(player, PlayerController);

        var riceBox = this.getOrCreateIngredientBox(ingredientBoxes, "RiceBox", "rice", "Rice Box", cc.v2(-300, 80));
        var fishBox = this.getOrCreateIngredientBox(ingredientBoxes, "FishBox", "fish", "Fish Box", cc.v2(-300, -80));
        this.getOrCreateWorkstation(workstations, "CuttingStation", "Cutting Station", "Press E to cut fish", cc.v2(220, 80));
        this.getOrCreateWorkstation(workstations, "AssemblyStation", "Assembly Station", "Press E to assemble sushi", cc.v2(220, -80));

        var hudView = this.getOrCreateHUD(uiRoot);
        var orderListView = this.getOrCreateOrderPanel(uiRoot);
        var promptView = this.getOrCreateInteractionPrompt(uiRoot);
        var pauseMenuView = this.getOrCreatePauseMenu(uiRoot);

        interactionSystem.interactableRoot = gameRoot;
        interactionSystem.interactionRadius = 120;

        playerHand.playerId = "player-1";
        playerController.playerId = "player-1";
        playerController.displayName = "Chef";
        playerController.moveSpeed = 220;
        playerController.inputManager = inputManager;
        playerController.interactionSystem = interactionSystem;
        playerController.playerHand = playerHand;

        playerManager.playerControllers = [playerController];

        gameManager.inputManager = inputManager;
        gameManager.timeManager = timeManager;
        gameManager.orderManager = orderManager;
        gameManager.economyManager = economyManager;
        gameManager.playerManager = playerManager;

        uiManager.hudView = hudView;
        uiManager.orderListView = orderListView;
        uiManager.interactionPromptView = promptView;
        uiManager.pauseMenuView = pauseMenuView;
        uiManager.gameManager = gameManager;
        uiManager.timeManager = timeManager;
        uiManager.orderManager = orderManager;
        uiManager.economyManager = economyManager;
        uiManager.interactionSystem = interactionSystem;
        uiManager.observedPlayers = [playerController];
        uiManager.observedPlayerHands = [playerHand];

        economyManager.configure({
            startingMoney: 0,
            bankruptcyThreshold: -999999,
            dailyCosts: {
                rent: 0,
                utilities: 0,
                ingredientBudget: 0,
                staff: 0,
            },
        });

        cc.log("MainSceneInitializer finished. Camera: " + mainCamera.name + ", Boxes: " + riceBox.name + ", " + fishBox.name);
    }

    private getOrCreateCanvas(): cc.Node {
        var canvasNode = cc.find("Canvas");
        if (!canvasNode) {
            canvasNode = new cc.Node("Canvas");
            cc.director.getScene().addChild(canvasNode);
        }

        canvasNode.setAnchorPoint(0.5, 0.5);
        canvasNode.setPosition(0, 0);
        canvasNode.setScale(1, 1);
        var canvas = canvasNode.getComponent(cc.Canvas) || canvasNode.addComponent(cc.Canvas);
        canvas.designResolution = cc.size(this.canvasWidth, this.canvasHeight);
        canvas.fitHeight = true;
        canvas.fitWidth = true;
        canvasNode.setContentSize(this.canvasWidth, this.canvasHeight);

        var widget = canvasNode.getComponent(cc.Widget);
        if (widget) {
            widget.enabled = false;
        }
        return canvasNode;
    }

    private getOrCreateCamera(canvasNode: cc.Node): cc.Node {
        var cameraNode = cc.find("Canvas/Main Camera");
        if (!cameraNode) {
            cameraNode = new cc.Node("Main Camera");
            canvasNode.addChild(cameraNode);
        }

        cameraNode.setPosition(0, 0);
        var camera = cameraNode.getComponent(cc.Camera) || cameraNode.addComponent(cc.Camera);
        camera.backgroundColor = cc.color(28, 31, 35, 255);
        camera.clearFlags = cc.Camera.ClearFlags.COLOR;
        return cameraNode;
    }

    private getOrCreateShopFloor(parent: cc.Node): cc.Node {
        var floor = this.getOrCreateChild(parent, "ShopFloor", cc.v2(0, -18), cc.size(980, 520));
        floor.zIndex = -100;
        this.drawRect(floor, cc.color(52, 58, 62, 255), 980, 520);

        var counter = this.getOrCreateChild(floor, "CounterArea", cc.v2(0, 170), cc.size(900, 92));
        this.drawRect(counter, cc.color(87, 75, 62, 255), 900, 92);

        var prep = this.getOrCreateChild(floor, "PrepArea", cc.v2(0, -38), cc.size(900, 300));
        this.drawRect(prep, cc.color(64, 70, 74, 255), 900, 300);
        return floor;
    }

    private getOrCreatePlayer(parent: cc.Node): cc.Node {
        var player = parent.getChildByName("Player");
        if (!player) {
            player = new cc.Node("Player");
            parent.addChild(player);
        }

        player.setPosition(-40, 0);
        player.setContentSize(48, 48);
        this.drawRect(player, cc.color(60, 130, 255, 255), 48, 48);
        this.centerLabel(this.getOrCreateLabel(player, "PlayerNameLabel", "Player", cc.v2(-42, 42), 18), 84);
        return player;
    }

    private getOrCreateIngredientBox(parent: cc.Node, nodeName: string, itemId: string, displayName: string, position: cc.Vec2): cc.Node {
        var node = this.getOrCreateChild(parent, nodeName, position, cc.size(96, 64));
        this.drawRect(node, cc.color(245, 210, 95, 255), 96, 64);
        this.centerLabel(this.getOrCreateLabel(node, "NameLabel", displayName, cc.v2(-48, 0), 18), 96);

        var box = this.getOrAdd(node, IngredientBox);
        box.itemId = itemId;
        box.displayName = displayName;
        return node;
    }

    private getOrCreateWorkstation(parent: cc.Node, nodeName: string, displayName: string, prompt: string, position: cc.Vec2): cc.Node {
        var node = this.getOrCreateChild(parent, nodeName, position, cc.size(130, 74));
        this.drawRect(node, cc.color(130, 130, 130, 255), 130, 74);
        this.centerLabel(this.getOrCreateLabel(node, "NameLabel", displayName, cc.v2(-65, 0), 18), 130);

        var station = this.getOrAdd(node, Workstation);
        station.workstationId = nodeName;
        station.displayName = displayName;
        station.interactionPrompt = prompt;
        return node;
    }

    private getOrCreateHUD(uiRoot: cc.Node): HUDView {
        var hudPanel = this.getOrCreateChild(uiRoot, "HUDPanel", cc.v2(0, 0), cc.size(this.canvasWidth, this.canvasHeight));
        var hud = this.getOrAdd(hudPanel, HUDView);

        hud.gameStateLabel = this.getOrCreateLabel(hudPanel, "GameStateLabel", "State: Ready", cc.v2(-596, 326), 20);
        hud.moneyLabel = this.getOrCreateLabel(hudPanel, "MoneyLabel", "Money: 0", cc.v2(-596, 296), 20);
        hud.timeLabel = this.getOrCreateLabel(hudPanel, "TimeLabel", "Time: 03:00", cc.v2(-596, 266), 20);
        hud.dayLabel = this.getOrCreateLabel(hudPanel, "DayLabel", "Day: 1", cc.v2(-596, 236), 20);
        hud.handItemLabel = this.getOrCreateLabel(hudPanel, "HandItemLabel", "Hand: Empty", cc.v2(-596, 206), 20);
        hud.interactableLabel = this.getOrCreateLabel(hudPanel, "InteractableLabel", "Interact: None", cc.v2(-596, 176), 20);
        hud.dayTierDayLabel = this.getOrCreateLabel(hudPanel, "DayTierDayLabel", "Day 1", cc.v2(500, 326), 24);
        hud.tierLabel = this.getOrCreateLabel(hudPanel, "TierLabel", "Tier 1", cc.v2(500, 294), 24);

        this.prepareTopLeftLabel(hud.gameStateLabel.node, 240);
        this.prepareTopLeftLabel(hud.moneyLabel.node, 240);
        this.prepareTopLeftLabel(hud.timeLabel.node, 240);
        this.prepareTopLeftLabel(hud.dayLabel.node, 240);
        this.prepareTopLeftLabel(hud.handItemLabel.node, 280);
        this.prepareTopLeftLabel(hud.interactableLabel.node, 300);
        this.prepareTopRightLabel(hud.dayTierDayLabel.node, 150);
        this.prepareTopRightLabel(hud.tierLabel.node, 150);
        return hud;
    }

    private getOrCreateOrderPanel(uiRoot: cc.Node): OrderListView {
        var panel = this.getOrCreateChild(uiRoot, "OrderPanel", cc.v2(-498, 28), cc.size(284, 192));
        this.drawRect(panel, cc.color(18, 21, 24, 210), 284, 192);

        var view = this.getOrAdd(panel, OrderListView);
        view.titleLabel = this.getOrCreateLabel(panel, "TitleLabel", "Orders", cc.v2(-126, 72), 24);
        view.contentRoot = this.getOrCreateChild(panel, "Content", cc.v2(0, 34), cc.size(240, 130));
        this.prepareTopLeftLabel(view.titleLabel.node, 180);
        return view;
    }

    private getOrCreateInteractionPrompt(uiRoot: cc.Node): InteractionPromptView {
        var panel = this.getOrCreateChild(uiRoot, "InteractionPromptPanel", cc.v2(0, -292), cc.size(640, 48));
        this.drawRect(panel, cc.color(0, 0, 0, 150), 640, 48);
        var view = this.getOrAdd(panel, InteractionPromptView);
        view.promptLabel = this.getOrCreateLabel(panel, "PromptLabel", "", cc.v2(0, 0), 24);
        view.promptLabel.node.setAnchorPoint(0.5, 0.5);
        view.promptLabel.node.setContentSize(640, 34);
        view.promptLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        panel.setPosition(0, -316);
        panel.active = false;
        return view;
    }

    private getOrCreatePauseMenu(uiRoot: cc.Node): PauseMenuView {
        var panel = this.getOrCreateChild(uiRoot, "PausePanel", cc.v2(0, 0), cc.size(360, 300));
        this.drawRect(panel, cc.color(0, 0, 0, 190), 360, 300);

        var view = this.getOrAdd(panel, PauseMenuView);
        this.centerLabel(this.getOrCreateLabel(panel, "PausedTitleLabel", "PAUSED", cc.v2(-100, 104), 32), 200);
        view.resumeButton = this.getOrCreateButton(panel, "ResumeButton", "Resume", cc.v2(0, 44));
        view.restartDayButton = this.getOrCreateButton(panel, "RestartDayButton", "Restart Day", cc.v2(0, -16));
        view.mainMenuButton = this.getOrCreateButton(panel, "MainMenuButton", "Main Menu", cc.v2(0, -76));
        view.hide();
        return view;
    }

    private getOrCreateChild(parent: cc.Node, name: string, position: cc.Vec2, size: cc.Size): cc.Node {
        var node = parent.getChildByName(name);
        if (!node) {
            node = new cc.Node(name);
            parent.addChild(node);
        }

        node.setPosition(position);
        node.setContentSize(size);
        return node;
    }

    private getOrCreateLabel(parent: cc.Node, name: string, text: string, position: cc.Vec2, fontSize: number): cc.Label {
        var node = parent.getChildByName(name);
        if (!node) {
            node = new cc.Node(name);
            parent.addChild(node);
        }

        node.setPosition(position);
        node.setAnchorPoint(0, 0.5);
        node.setContentSize(420, 32);
        var label = node.getComponent(cc.Label) || node.addComponent(cc.Label);
        label.string = text;
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 6;
        label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        label.verticalAlign = cc.Label.VerticalAlign.CENTER;
        return label;
    }

    private getOrCreateButton(parent: cc.Node, name: string, text: string, position: cc.Vec2): cc.Button {
        var node = parent.getChildByName(name);
        if (!node) {
            node = new cc.Node(name);
            parent.addChild(node);
        }

        node.setPosition(position);
        node.setContentSize(220, 44);
        this.drawRect(node, cc.color(55, 65, 78, 255), 220, 44);
        var button = node.getComponent(cc.Button) || node.addComponent(cc.Button);
        button.transition = cc.Button.Transition.NONE;

        var label = this.getOrCreateLabel(node, "Label", text, cc.v2(-84, 0), 20);
        label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        label.node.setPosition(0, 0);
        label.node.setContentSize(220, 34);
        return button;
    }

    private drawRect(node: cc.Node, color: cc.Color, width: number, height: number): void {
        var graphics = node.getComponent(cc.Graphics) || node.addComponent(cc.Graphics);
        graphics.clear();
        graphics.fillColor = color;
        graphics.rect(-width * 0.5, -height * 0.5, width, height);
        graphics.fill();
    }

    private getOrAdd<T extends cc.Component>(node: cc.Node, componentClass: any): T {
        return node.getComponent(componentClass) || node.addComponent(componentClass);
    }

    private prepareTopLeftLabel(node: cc.Node, width: number): void {
        node.setAnchorPoint(0, 0.5);
        node.setContentSize(width, 30);
        this.disableWidget(node);
    }

    private prepareTopRightLabel(node: cc.Node, width: number): void {
        node.setAnchorPoint(0, 0.5);
        node.setContentSize(width, 32);
        this.disableWidget(node);
    }

    private disableWidget(node: cc.Node): void {
        var widget = node.getComponent(cc.Widget);
        if (widget) {
            widget.enabled = false;
        }
    }

    private centerLabel(label: cc.Label, width: number): void {
        label.node.setAnchorPoint(0, 0.5);
        label.node.setContentSize(width, label.node.height);
        label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    }

    private alignTopLeft(node: cc.Node, left: number, top: number): void {
        var widget = node.getComponent(cc.Widget) || node.addComponent(cc.Widget);
        widget.isAlignLeft = true;
        widget.isAlignTop = true;
        widget.left = left;
        widget.top = top;
        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
    }

    private alignTopRight(node: cc.Node, right: number, top: number): void {
        var widget = node.getComponent(cc.Widget) || node.addComponent(cc.Widget);
        widget.isAlignRight = true;
        widget.isAlignTop = true;
        widget.right = right;
        widget.top = top;
        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
    }

    private alignBottomCenter(node: cc.Node, horizontalCenter: number, bottom: number): void {
        var widget = node.getComponent(cc.Widget) || node.addComponent(cc.Widget);
        widget.isAlignHorizontalCenter = true;
        widget.isAlignBottom = true;
        widget.horizontalCenter = horizontalCenter;
        widget.bottom = bottom;
        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
    }
}
