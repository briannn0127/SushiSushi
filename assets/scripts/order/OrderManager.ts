const { ccclass, property } = cc._decorator;

import { GameEvents, OrderData, RecipeData, SushiData } from "../data/DataTypes";

@ccclass
export default class OrderManager extends cc.Component {
    private activeOrders: OrderData[] = [];
    private recipes: { [id: string]: RecipeData } = {};
    private nextOrderIndex: number = 1;

    public registerRecipes(recipeList: RecipeData[]): void {
        this.recipes = {};
        for (var i = 0; i < recipeList.length; i++) {
            this.recipes[recipeList[i].id] = recipeList[i];
        }
    }

    public createOrder(customerId: string, recipeId: string, maxWaitSeconds: number): OrderData {
        var order: OrderData = {
            id: "order-" + this.nextOrderIndex++,
            customerId: customerId,
            recipeId: recipeId,
            createdAt: cc.director.getTotalTime() / 1000,
            maxWaitSeconds: maxWaitSeconds,
            fulfilled: false,
        };

        this.activeOrders.push(order);
        cc.systemEvent.emit(GameEvents.ORDER_CREATED, order);
        return order;
    }

    public completeOrder(orderId: string, sushi: SushiData): OrderData {
        for (var i = 0; i < this.activeOrders.length; i++) {
            if (this.activeOrders[i].id === orderId) {
                this.activeOrders[i].fulfilled = true;
                var completed = this.activeOrders.splice(i, 1)[0];
                cc.systemEvent.emit(GameEvents.ORDER_COMPLETED, completed, sushi);
                return completed;
            }
        }

        return null;
    }

    public getActiveOrders(): OrderData[] {
        return this.activeOrders.slice();
    }

    public getRecipe(recipeId: string): RecipeData {
        return this.recipes[recipeId] || null;
    }

    public clearOrders(): void {
        this.activeOrders = [];
    }
}
