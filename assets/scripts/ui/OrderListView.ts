const { ccclass, property } = cc._decorator;

import OrderItemView from "./OrderItemView";
import { OrderItemUIModel } from "./UIModels";

@ccclass
export default class OrderListView extends cc.Component {
    @property(cc.Label)
    public titleLabel: cc.Label = null;

    @property(cc.Node)
    public contentRoot: cc.Node = null;

    @property(cc.Prefab)
    public orderItemPrefab: cc.Prefab = null;

    private itemViews: { [orderId: string]: OrderItemView } = {};
    private warnedContentRoot: boolean = false;
    private warnedPrefab: boolean = false;
    private warnedTitle: boolean = false;

    public setTitle(title: string): void {
        if (!this.titleLabel) {
            if (!this.warnedTitle) {
                this.warnedTitle = true;
                cc.warn("OrderListView.titleLabel is not assigned.");
            }
            return;
        }

        this.titleLabel.string = title;
    }

    public updateOrders(orders: OrderItemUIModel[]): void {
        this.setTitle("Orders");
        var activeIds: { [orderId: string]: boolean } = {};

        for (var i = 0; i < orders.length; i++) {
            var model = orders[i];
            activeIds[model.orderId] = true;

            var view = this.itemViews[model.orderId];
            if (!view) {
                view = this.createItemView(model.orderId);
            }

            if (view) {
                view.bind(model);
            }
        }

        this.removeInactiveItems(activeIds);
    }

    public clear(): void {
        for (var orderId in this.itemViews) {
            if (this.itemViews.hasOwnProperty(orderId) && this.itemViews[orderId]) {
                this.itemViews[orderId].node.destroy();
            }
        }
        this.itemViews = {};
    }

    private createItemView(orderId: string): OrderItemView {
        if (!this.contentRoot) {
            if (!this.warnedContentRoot) {
                this.warnedContentRoot = true;
                cc.warn("OrderListView.contentRoot is not assigned.");
            }
            return null;
        }

        if (!this.orderItemPrefab) {
            if (!this.warnedPrefab) {
                this.warnedPrefab = true;
                cc.warn("OrderListView.orderItemPrefab is not assigned. Creating simple runtime order item.");
            }
            return this.createSimpleItemView(orderId);
        }

        var node = cc.instantiate(this.orderItemPrefab);
        this.contentRoot.addChild(node);

        var view = node.getComponent(OrderItemView);
        if (!view) {
            cc.warn("Order item prefab must include OrderItemView.");
            node.destroy();
            return null;
        }

        this.itemViews[orderId] = view;
        return view;
    }

    private createSimpleItemView(orderId: string): OrderItemView {
        var node = new cc.Node("OrderItem_" + orderId);
        this.contentRoot.addChild(node);
        node.setContentSize(220, 34);
        node.setPosition(0, -Object.keys(this.itemViews).length * 40);

        var view = node.addComponent(OrderItemView);
        view.sushiNameLabel = this.createLabel(node, "SushiNameLabel", cc.v2(-92, 0), 18, 132);
        view.remainingTimeLabel = this.createLabel(node, "RemainingTimeLabel", cc.v2(70, 0), 18, 60);
        this.itemViews[orderId] = view;
        return view;
    }

    private createLabel(parent: cc.Node, name: string, position: cc.Vec2, fontSize: number, width: number): cc.Label {
        var node = new cc.Node(name);
        parent.addChild(node);
        node.setPosition(position);
        node.setContentSize(width, 28);
        var label = node.addComponent(cc.Label);
        label.fontSize = fontSize;
        label.lineHeight = fontSize + 6;
        label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        label.verticalAlign = cc.Label.VerticalAlign.CENTER;
        return label;
    }

    private removeInactiveItems(activeIds: { [orderId: string]: boolean }): void {
        var removeIds: string[] = [];
        for (var orderId in this.itemViews) {
            if (this.itemViews.hasOwnProperty(orderId) && !activeIds[orderId]) {
                removeIds.push(orderId);
            }
        }

        for (var i = 0; i < removeIds.length; i++) {
            var id = removeIds[i];
            if (this.itemViews[id]) {
                this.itemViews[id].node.destroy();
            }
            delete this.itemViews[id];
        }
    }
}
