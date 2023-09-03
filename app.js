document.addEventListener("DOMContentLoaded", () => calculator.init());

const calculator = {
    values: [],
    keys: document.querySelectorAll("[data-key]"),
    resetBtn: document.querySelector("#reset"),
    backBtn: document.querySelector("#back"),
    calculateBtn: document.querySelector("#calculate"),
    output: document.querySelector("#output"),
    init: function() {
        calculator.bindKeyHandler();
        calculator.bindBackHandler();
        calculator.bindResetHandler();
        calculator.bindCalculateHandler();
    },
    bindKeyHandler: function() {
        let canUseDecimal = true;
        calculator.keys.forEach(key => {
            key.addEventListener("click", function(e) {
                if (this.dataset.type === 'operator') {
                    if (!calculator.values.length || calculator.values[calculator.values.length - 1].type === 'operator' || calculator.values[calculator.values.length - 1].key === '.') {
                        e.preventDefault();
                        return false;
                    }

                    canUseDecimal = true;
                } else if (this.dataset.type === 'value' && this.dataset.key === ".") {
                    if (!canUseDecimal) {
                        e.preventDefault();
                        return false;
                    }

                    canUseDecimal = false;
                }

                calculator.values.push({
                    key: this.dataset.key,
                    type: this.dataset.type
                });
                calculator.printOutput();
            });
        });
    },
    bindBackHandler: function() {
        calculator.backBtn.addEventListener("click", () => {
            if (!calculator.values.length) return;

            calculator.values.pop();
            calculator.printOutput();
        });
    },
    bindResetHandler: function() {
        calculator.resetBtn.addEventListener("click", () => {
            calculator.values.length = 0;
            calculator.printOutput();
        });
    },
    bindCalculateHandler: function() {
        calculator.calculateBtn.addEventListener("click", () => {
            const length = calculator.values.length;

            if (length === 0 || calculator.values[length - 1].type === 'operator' || calculator.values[length - 1].key === '.') return false;

            let decimalInNumber = 0;
            const prepareCalculation = [];

            for (let i = 0; i < length; i++) {
                if (calculator.values[i].key === ".") {
                    if (decimalInNumber > 0) return false;
                    decimalInNumber++;
                }

                if (prepareCalculation.length === 0) prepareCalculation.push("0");

                if (calculator.values[i].type === "operator") {
                    decimalInNumber = 0;
                    prepareCalculation.push(calculator.values[i].key);
                    prepareCalculation.push("0");
                } else {
                    prepareCalculation[prepareCalculation.length - 1] = prepareCalculation[prepareCalculation.length - 1].concat(calculator.values[i].key);
                }
            }

            if (prepareCalculation.length > 0) {
                ["/", "*", "+", "-"].forEach(operator => {
                    let previousValue = null;
                    let lastOperator = null;

                    for (let i = 0; i < prepareCalculation.length; i++) {
                        if (prepareCalculation.length === 1) break;
                        if (/^([0-9\.]+)$/.test(prepareCalculation[i])) {
                            let output = null;
                            if (lastOperator && previousValue) {
                                if (lastOperator === "/") {
                                    output = previousValue / prepareCalculation[i];
                                } else if (lastOperator === "*") {
                                    output = previousValue * prepareCalculation[i];
                                } else if (lastOperator === "+") {
                                    output = previousValue + parseFloat(prepareCalculation[i]);
                                } else if (lastOperator === "-") {
                                    output = previousValue - prepareCalculation[i];
                                }
    
                                if (output) {
                                    prepareCalculation[i - 2] = output;
                                    prepareCalculation.splice(i - 1, 2);
                                    if (prepareCalculation.length === 1) break;
                                    i = -1;
                                    previousValue = null;
                                    lastOperator = null;
                                    continue;
                                }
                            }
                            previousValue = output ?? parseFloat(prepareCalculation[i]);
                            lastOperator = null;
                        } else if (operator === prepareCalculation[i]) {
                            lastOperator = operator;
                        } else {
                            previousValue = null;
                        }
                    }
                });

                calculator.values = [{key: prepareCalculation[0], type: "value"}];
                calculator.printOutput();
            }
        });
    },
    printOutput: function() {
        let output = 0;
        if (calculator.values.length) {
            output = calculator.values.reduce((previousValue, currentValue) => {
                if (previousValue === "0") previousValue = "";
                return previousValue + currentValue.key;
            }, output.toString());
        }

        calculator.output.textContent = output;
    }
};