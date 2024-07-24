export function max(a, b) {
    return a > b ? a : b;
}

export function fizzBuzz(n) {
    switch (true) {
        case n % 3 === 0 && n % 5 === 0:
            return "FizzBuzz";
        case n % 3 === 0:
            return "Fizz";
        case n % 5 === 0:
            return "Buzz";
        default:
            return n.toString();
    }
}

export function calculateAverage(numbers) {
    if (!numbers.length) return NaN;
    const sum = numbers.reduce((sum, currentValue) => (sum += currentValue), 0);
    return sum / numbers.length;
}

export function factorial(number) {
    if (number < 0) return undefined;
    if (number == 0 || number == 1) return 1;
    return number * factorial(--number);
}
