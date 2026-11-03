// Factory for creating shopping lists
const shoppingListFactory = {
    counter: 0,

    create(name, items = []) {
        return {
            id: ++shoppingListFactory.counter,
            name,
            items
        };
    }
};

export default shoppingListFactory;