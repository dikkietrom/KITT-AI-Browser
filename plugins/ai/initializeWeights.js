// Initialize weights randomly
let weights = [];
for (let i = 0; i < 10; i++) {
    let neuronWeights = [];
    for (let j = 0; j < 7; j++) {
        neuronWeights.push(Math.random());
    }
    weights.push(neuronWeights);
}
