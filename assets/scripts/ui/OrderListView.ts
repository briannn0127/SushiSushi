const { ccclass, property } = cc._decorator;

import OrderItemView from "./OrderItemView";
import { OrderItemUIModel } from "./UIModels";

@ccclass
export default class OrderListView extends cc.Component {
    @property(cc.Node)
    public contentRoot: cc.Node = null;

    @property(cc.Prefab)
    public orderItemPrefab: cc.Prefab = null;

    private itemViews: { [orderId: string]: OrderItemView } = {};
    private warnedContentRoot: boolean = false;
    private warnedPrefab: boolean = false;

    public updateOrders(orders: OrderItemUIModel[]): void {
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
                cc.warn("OrderListView.orderItemPrefab is not assigned.");
            }
            return null;
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
