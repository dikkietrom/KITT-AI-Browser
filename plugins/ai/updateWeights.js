// Update weights
function updateWeights(errors, input) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 7; j++) {
            weights[i][j] += errors[i] * input[j];
        }
    }
}
