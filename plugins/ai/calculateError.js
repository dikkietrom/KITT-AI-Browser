// Calculate error
function calculateError(outputs, target) {
    let errors = [];
    for (let i = 0; i < 10; i++) {
        errors.push(target[i] - outputs[i]);
    }
    return errors;
}
