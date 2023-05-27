// Define the function for a single forward pass
function forwardPass(input) {
    let outputs = [];
    for (let i = 0; i < 10; i++) {
        let sum = 0;
        for (let j = 0; j < 7; j++) {
            sum += input[j] * weights[i][j];
        }
        outputs.push(activationFunction(sum));
    }
    return outputs;
}
