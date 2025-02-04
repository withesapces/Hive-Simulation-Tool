document.getElementById("simulationForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    let tokensHP = parseFloat(document.getElementById("currentHP").value) || 0;
    let currentHP = tokensHP * 0.33;
    let currentHBD = parseFloat(document.getElementById("currentHBD").value) || 0;
    const weeklyDeposit = parseFloat(document.getElementById("weeklyDeposit").value) || 0;
    const hpPercent = parseFloat(document.getElementById("hpPercent").value) || 50;
    const annualInterestHP = parseFloat(document.getElementById("annualInterestHP").value) || 3;
    const annualInterestHBD = parseFloat(document.getElementById("annualInterestHBD").value) || 15;
    const simulationYears = parseFloat(document.getElementById("simulationYears").value) || 42;
  
    // Appelle les fonctions de calcul et d'affichage
    runSimulation(currentHP, currentHBD, weeklyDeposit, hpPercent, annualInterestHP, annualInterestHBD, simulationYears);
  });
  