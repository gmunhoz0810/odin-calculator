// Get elements
const display = document.querySelector("#main-display");
const secondaryDisplay = document.querySelector("#secondary-display");
const numButtons = Array.from(document.querySelectorAll(".num"));
const operatorButtons = Array.from(document.querySelectorAll(".operator"));
const clearButton = document.querySelector("#clear");
const equalsButton = document.querySelector("#equals");
const sqrtButton = document.querySelector("#sqrt"); // change this to the actual selector for your square root button
const squareButton = document.querySelector("#square"); // change this to the actual selector for your square button

// Variables to store values and operator
let num1 = "";
let num2 = "";
let operator = "";
let previousOperator = "";

// Function to round a number to 3 significant figures
function toFixed(num) {
  return parseFloat(num.toFixed(3));
}

// Function to format large numbers
function formatNumber(num) {
  const maxDigits = 8;
  let formattedNum;

  // Convert numbers with absolute value >= 1e8 or < 1e-2 (except 0) to scientific notation
  if (Math.abs(num) >= 1e8 || (Math.abs(num) > 0 && Math.abs(num) < 1e-2)) {
    formattedNum = num.toExponential(3);
  } else {
    formattedNum = Number(num).toFixed(3);
    // Remove trailing zeros and decimal point if not necessary
    formattedNum = parseFloat(formattedNum).toString();
  }

  if (formattedNum.length > maxDigits) {
    // If formatted number is still too large, switch to scientific notation
    formattedNum = num.toExponential(3);
  }

  // If the number is still too large, display an error message
  if (formattedNum.length > maxDigits) {
    formattedNum = "ERROR";
  }

  return formattedNum;
}
// Remove selected class from all operator buttons
function deselectOperators() {
  operatorButtons.forEach((button) => button.classList.remove("selected"));
}

// Listen for number button clicks
numButtons.forEach((button) => {
  button.addEventListener("click", () => {
    deselectOperators();
    if (
      button.textContent === "." &&
      (num1.includes(".") || num2.includes("."))
    ) {
      // If the button is '.' and either num1 or num2 already includes a '.', do nothing
      return;
    }

    if (!operator) {
      num1 += button.textContent;
      display.textContent =
        num1.length <= 10 ? num1 : parseFloat(num1).toExponential(3);
    } else {
      num2 += button.textContent;
      display.textContent =
        num2.length <= 10 ? num2 : parseFloat(num2).toExponential(3);
    }
  });
});

// Listen for operator button clicks
operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    deselectOperators();
    button.classList.add("selected");
    operator = button.textContent;
    if (!num1) {
      num1 = "0";
    }
    if (!num2) {
      secondaryDisplay.textContent = `${num1} ${operator} `;
    } else {
      const result = operate(
        previousOperator,
        parseFloat(num1),
        parseFloat(num2)
      );
      num1 = toFixed(result);
      num2 = "";
      secondaryDisplay.textContent = `${num1} ${operator} `;
    }
    previousOperator = operator;
  });
});

// Listen for clear button clicks
clearButton.addEventListener("click", () => {
  deselectOperators();
  num1 = "";
  num2 = "";
  operator = "";
  previousOperator = "";
  display.textContent = "0";
  secondaryDisplay.textContent = "";
});

// Listen for equals button clicks
equalsButton.addEventListener("click", () => {
  deselectOperators();
  if (num1 && num2 && operator) {
    let result = operate(operator, parseFloat(num1), parseFloat(num2));
    result = formatNumber(result);

    display.textContent = result;
    secondaryDisplay.textContent = `${num1} ${previousOperator} ${num2} =`;
    num1 = result.toString();
    num2 = "";
    operator = "";
    previousOperator = "";
  } else {
    alert("Please enter a valid operation");
  }
});

// Listen for square root button clicks
sqrtButton.addEventListener("click", () => {
  if (num1 && !num2 && !operator) {
    const result = operate("√", parseFloat(num1), null);
    display.textContent = formatNumber(toFixed(result));
    num1 = result.toString();
  }
});

// Listen for square button clicks
squareButton.addEventListener("click", () => {
  if (num1 && !num2 && !operator) {
    const result = operate("x²", parseFloat(num1), null);
    display.textContent = formatNumber(toFixed(result));
    num1 = result.toString();
  }
});

// Operator functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    alert("Cannot divide by 0");
    return 0;
  } else {
    return a / b;
  }
}

function sqrt(a) {
  return Math.sqrt(a);
}

function square(a) {
  return a * a;
}

// Operate function
function operate(operator, a, b) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "×":
      return multiply(a, b);
    case "÷":
      return divide(a, b);
    case "√":
      return sqrt(a);
    case "x²":
      return square(a);
    default:
      return 0;
  }
}
