// Factory for creating items
const itemFactory = {
    counter: 0,

    create(name, quantity = 1, bought = false) {
        return {
            id: ++itemFactory.counter,
            name,
            quantity: quantity ?? 1,
            bought: bought ?? false
        };
    }
};

export default itemFactory;