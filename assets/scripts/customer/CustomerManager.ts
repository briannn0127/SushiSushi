const { ccclass, property } = cc._decorator;

import OrderManager from "../order/OrderManager";
import { CustomerData, GameEvents } from "../data/DataTypes";

@ccclass
export default class CustomerManager extends cc.Component {
    @property(OrderManager)
    public orderManager: OrderManager = null;

    @property
    public defaultPatienceSeconds: number = 45;

    private customers: CustomerData[] = [];
    private availableRecipeIds: string[] = [];
    private nextCustomerIndex: number = 1;

    public configure(recipeIds: string[]): void {
        this.availableRecipeIds = recipeIds.slice();
    }

    public spawnCustomer(): CustomerData {
        var customer: CustomerData = {
            id: "customer-" + this.nextCustomerIndex++,
            displayName: "Customer",
            patienceSeconds: this.defaultPatienceSeconds,
            baseTipMultiplier: 1,
        };

        this.customers.push(customer);
        cc.systemEvent.emit(GameEvents.CUSTOMER_SPAWNED, customer);

        if (this.orderManager && this.availableRecipeIds.length > 0) {
            var recipeId = this.availableRecipeIds[Math.floor(Math.random() * this.availableRecipeIds.length)];
            this.orderManager.createOrder(customer.id, recipeId, customer.patienceSeconds);
        }

        return customer;
    }

    public getCustomers(): CustomerData[] {
        return this.customers.slice();
    }

    public clearCustomers(): void {
        this.customers = [];
    }
}
