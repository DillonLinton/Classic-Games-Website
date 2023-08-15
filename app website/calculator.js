function clearResult() {
  document.getElementById('result').value = '';
}

function appendToResult(value) {
  document.getElementById('result').value += value;
}

function calculateResult() {
  const result = document.getElementById('result').value;
  try {
    const calculatedResult = eval(result);
    document.getElementById('result').value = calculatedResult;
  } catch (error) {
    document.getElementById('result').value = 'Error';
  }
}

function calculateSqrt() {
  const result = document.getElementById('result').value;
  try {
    const calculatedResult = Math.sqrt(eval(result));
    document.getElementById('result').value = calculatedResult;
  } catch (error) {
    document.getElementById('result').value = 'Error';
  }
}

function calculatePower() {
  const result = document.getElementById('result').value;
  try {
    const calculatedResult = eval(result) ** 2;
    document.getElementById('result').value = calculatedResult;
  } catch (error) {
    document.getElementById('result').value = 'Error';
  }
}

function goToHome() {
  window.location.href = "index.html";
}
