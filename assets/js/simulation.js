document.getElementById("simulationForm").addEventListener("submit", function(event) {
  event.preventDefault();
  
  // Récupération des valeurs saisies
  // Pour le HP, on récupère directement le nombre de tokens
  let tokensHP = parseFloat(document.getElementById("currentHP").value) || 0;
  let currentHBD = parseFloat(document.getElementById("currentHBD").value) || 0;
  const weeklyDeposit = parseFloat(document.getElementById("weeklyDeposit").value) || 0;
  const hpPercent = parseFloat(document.getElementById("hpPercent").value) || 50;
  const annualInterestHP = parseFloat(document.getElementById("annualInterestHP").value) || 3;
  const annualInterestHBD = parseFloat(document.getElementById("annualInterestHBD").value) || 15;
  const simulationYears = parseFloat(document.getElementById("simulationYears").value) || 42;
  
  // Définition du taux de conversion HP ($ -> tokens)
  const hpTokenPrice = 0.33;
  
  // Calculs de base
  const simulationMonths = simulationYears * 12;
  const monthlyDeposit = weeklyDeposit * 4.345; // Conversion approximative des semaines en mois
  const monthlyRateHP = annualInterestHP / 12 / 100;
  const monthlyRateHBD = annualInterestHBD / 12 / 100;
  
  // Objectifs :
  // 1. Capital total >= 1 000 000 $
  // 2. Générer environ 40k$/an d'intérêts (~3333.33 $/mois)
  let targetMillionMonth = null;
  let targetRetirementMonth = null;
  const retirementMonthlyTarget = 40000 / 12;
  
  // Stockage des instantanés annuels pour reporting
  let snapshots = [];
  
  // Simulation mois par mois
  for (let m = 1; m <= simulationMonths; m++) {
    // Dépôt mensuel
    // Pour le HP, on convertit la part en dollars en tokens :
    let depositHP_Dollars = monthlyDeposit * (hpPercent / 100);
    let depositHP_Tokens = depositHP_Dollars / hpTokenPrice;
    tokensHP += depositHP_Tokens;
    
    // Pour le HBD, la somme est directement en dollars
    currentHBD += monthlyDeposit * ((100 - hpPercent) / 100);
    
    // Application des intérêts composés mensuels
    // Pour le HP, on applique l'intérêt sur le nombre de tokens (la valeur en dollars sera tokensHP * hpTokenPrice)
    tokensHP *= (1 + monthlyRateHP);
    // Pour le HBD, on applique directement l'intérêt sur le montant en dollars
    currentHBD *= (1 + monthlyRateHBD);
    
    // Calcul de la valeur actuelle du HP en dollars
    let currentHP_Value = tokensHP * hpTokenPrice;
    
    // Vérification des objectifs
    if (!targetMillionMonth && (currentHP_Value + currentHBD >= 1000000)) {
      targetMillionMonth = m;
    }
    if (!targetRetirementMonth && ((currentHP_Value * monthlyRateHP) + (currentHBD * monthlyRateHBD) >= retirementMonthlyTarget)) {
      targetRetirementMonth = m;
    }
    
    // Sauvegarde de l'instantané en fin d'année
    if (m % 12 === 0) {
      snapshots.push({
        year: m / 12,
        hp: currentHP_Value,
        hbd: currentHBD,
        total: currentHP_Value + currentHBD,
        annualDeposit: monthlyDeposit * 12,
        hpInterest: currentHP_Value * (annualInterestHP / 100),
        hbdInterest: currentHBD * (annualInterestHBD / 100)
      });
    }
  }
  
  // Construction de l'affichage des résultats avec les traductions
  let resultsHTML = `<h2 class='nb-heading'>${translations[currentLang].simulationResults}</h2>`;
  resultsHTML += `<p><strong>${translations[currentLang].finalCapital}</strong> ${( (tokensHP * hpTokenPrice) + currentHBD ).toLocaleString(currentLang, { style: 'currency', currency: 'USD' })}</p>`;
  resultsHTML += `<p><strong>${translations[currentLang].finalHP}</strong> ${(tokensHP * hpTokenPrice).toLocaleString(currentLang, { style: 'currency', currency: 'USD' })}</p>`;
  resultsHTML += `<p><strong>${translations[currentLang].finalHBD}</strong> ${currentHBD.toLocaleString(currentLang, { style: 'currency', currency: 'USD' })}</p>`;
  
  if (targetMillionMonth) {
    const years = Math.floor(targetMillionMonth / 12);
    const months = targetMillionMonth % 12;
    resultsHTML += `<p><strong>${translations[currentLang].millionObjective}</strong> ${years} ${currentLang === 'fr' ? "an(s) et" : "year(s) and"} ${months} ${currentLang === 'fr' ? "mois." : "month(s)."}</p>`;
  } else {
    resultsHTML += `<p><strong>${translations[currentLang].millionNotReached}</strong> ${currentLang === 'fr' ? "dans la durée simulée." : "within the simulated period."}</p>`;
  }
  
  if (targetRetirementMonth) {
    const years = Math.floor(targetRetirementMonth / 12);
    const months = targetRetirementMonth % 12;
    resultsHTML += `<p><strong>${translations[currentLang].retirementObjective}</strong> ${years} ${currentLang === 'fr' ? "an(s) et" : "year(s) and"} ${months} ${currentLang === 'fr' ? "mois." : "month(s)."}</p>`;
  } else {
    resultsHTML += `<p><strong>${translations[currentLang].retirementNotReached}</strong> ${currentLang === 'fr' ? "dans la durée simulée." : "within the simulated period."}</p>`;
  }
  
  // Tableau récapitulatif avec pagination
  resultsHTML += `<h3 class='nb-heading'>${translations[currentLang].annualSummary}</h3>`;
  resultsHTML += `
    <div id="tableContainer">
      <table id="annualSummaryTable">
        <thead>
          <tr>
            <th>${translations[currentLang].tableYear}</th>
            <th>${translations[currentLang].tableHP}</th>
            <th>${translations[currentLang].tableHPInterest}</th>
            <th>${translations[currentLang].tableHBD}</th>
            <th>${translations[currentLang].tableHBDInterest}</th>
            <th>${translations[currentLang].tableTotal}</th>
          </tr>
        </thead>
        <tbody>
          ${snapshots.map(snapshot => `
            <tr>
              <td>${snapshot.year}</td>
              <td>${snapshot.hp.toLocaleString(currentLang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>${snapshot.hpInterest.toLocaleString(currentLang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>${snapshot.hbd.toLocaleString(currentLang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>${snapshot.hbdInterest.toLocaleString(currentLang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>${snapshot.total.toLocaleString(currentLang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div id="pagination" class="pagination">
        <!-- Les boutons de pagination seront ajoutés dynamiquement -->
      </div>
    </div>
  `;
  
  // Graphique avec Plotly
  resultsHTML += `
    <h3 class='nb-heading'>${translations[currentLang].chartTitle}</h3>
    <div id="chartContainer" style="width: 100%; height: 400px;"></div>
  `;
  
  document.getElementById("results").innerHTML = resultsHTML;
  
  // Chargement et configuration du graphique Plotly
  const script = document.createElement('script');
  script.src = 'https://cdn.plot.ly/plotly-latest.min.js';
  script.onload = function() {
    const chartData = [
      {
        x: snapshots.map(s => s.year),
        y: snapshots.map(s => s.hpInterest + s.hbdInterest),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Interest',
        line: {
          color: 'var(--primary-color)',
          width: 4,
        },
        marker: {
          color: 'var(--accent-color)',
          size: 10,
          line: {
            color: 'var(--primary-color)',
            width: 3
          }
        }
      }
    ];
    
    const layout = {
      title: {
        text: translations[currentLang].chartTitle,
        font: {
          family: 'Helvetica Neue, Arial, sans-serif',
          size: 24,
          color: 'var(--primary-color)',
          weight: '900'
        }
      },
      paper_bgcolor: 'var(--background-color)',
      plot_bgcolor: 'white',
      xaxis: { 
        title: {
          text: currentLang === 'fr' ? "Année" : "Year",
          font: {
            family: 'Helvetica Neue, Arial, sans-serif',
            size: 16,
            color: 'var(--primary-color)'
          }
        },
        gridcolor: 'var(--primary-color)',
        zerolinecolor: 'var(--primary-color)',
        tickfont: {
          color: 'var(--primary-color)'
        }
      },
      yaxis: { 
        title: {
          text: currentLang === 'fr' ? "Montant ($)" : "Amount ($)",
          font: {
            family: 'Helvetica Neue, Arial, sans-serif',
            size: 16,
            color: 'var(--primary-color)'
          }
        },
        gridcolor: 'var(--primary-color)',
        zerolinecolor: 'var(--primary-color)',
        tickfont: {
          color: 'var(--primary-color)'
        }
      },
      margin: {
        l: 60,
        r: 30,
        t: 80,
        b: 60
      },
      shapes: [
        {
          type: 'rect',
          xref: 'paper',
          yref: 'paper',
          x0: 0,
          y0: 0,
          x1: 1,
          y1: 1,
          line: {
            color: 'var(--primary-color)',
            width: 3
          }
        }
      ]
    };
    
    const config = {
      responsive: true,
      displayModeBar: false
    };
    
    Plotly.newPlot('chartContainer', chartData, layout, config);
  };
  document.head.appendChild(script);
  
  // Pagination pour le tableau
  function setupPagination() {
    const table = document.getElementById('annualSummaryTable');
    const rows = table.querySelectorAll('tbody tr');
    const pagination = document.getElementById('pagination');
    const itemsPerPage = 10;
    const totalPages = Math.ceil(rows.length / itemsPerPage);
    
    function showPage(page) {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      rows.forEach((row, index) => {
        row.style.display = (index >= start && index < end) ? '' : 'none';
      });
      updatePaginationButtons(page);
    }
    
    function updatePaginationButtons(currentPage) {
      pagination.innerHTML = '';
      if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = currentLang === 'fr' ? "Précédent" : "Previous";
        prevButton.classList.add('nb-btn');
        prevButton.onclick = () => showPage(currentPage - 1);
        pagination.appendChild(prevButton);
      }
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('nb-btn');
        pageButton.style.margin = '0 5px';
        pageButton.style.backgroundColor = i === currentPage ? 'var(--accent-color)' : 'var(--primary-color)';
        pageButton.onclick = () => showPage(i);
        pagination.appendChild(pageButton);
      }
      if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = currentLang === 'fr' ? "Suivant" : "Next";
        nextButton.classList.add('nb-btn');
        nextButton.onclick = () => showPage(currentPage + 1);
        pagination.appendChild(nextButton);
      }
    }
    
    showPage(1);
  }
  setTimeout(setupPagination, 100);
});

async function fetchHiveData() {
  const username = document.getElementById("hiveUsername").value.trim();
  if (!username) {
      alert("Please enter a Hive username.");
      return;
  }

  try {
      // 1️⃣ Récupérer les infos de l'utilisateur
      const userResponse = await fetch("https://api.hive.blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              jsonrpc: "2.0",
              method: "condenser_api.get_accounts",
              params: [[username]],
              id: 1
          })
      });

      const userData = await userResponse.json();
      if (!userData.result || userData.result.length === 0) {
          alert("User not found.");
          return;
      }

      const user = userData.result[0];

      console.log(user);

      // 2️⃣ Récupérer les paramètres globaux pour la conversion VESTS → HP
      const globalResponse = await fetch("https://api.hive.blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              jsonrpc: "2.0",
              method: "condenser_api.get_dynamic_global_properties",
              params: [],
              id: 1
          })
      });

      const globalData = await globalResponse.json();
      if (!globalData.result) {
          alert("Failed to fetch global properties.");
          return;
      }

      const totalVestingFundHive = parseFloat(globalData.result.total_vesting_fund_hive.replace(" HIVE", ""));
      const totalVestingShares = parseFloat(globalData.result.total_vesting_shares.replace(" VESTS", ""));

      // 3️⃣ Calculer le taux de conversion actuel
      const vestingToHP = totalVestingFundHive / totalVestingShares;

      // 4️⃣ Extraire les valeurs nécessaires
      const vestingShares = parseFloat(user.vesting_shares.replace(" VESTS", "")) || 0;
      const delegatedVests = parseFloat(user.delegated_vesting_shares.replace(" VESTS", "")) || 0;

      // 5️⃣ Conversion exacte
      const hivePower = (vestingShares - delegatedVests) * vestingToHP;

      // 6️⃣ Balances en HIVE et HBD
      const hiveLiquid = parseFloat(user.balance.replace(" HIVE", "")) || 0;
      const hiveSavings = parseFloat(user.savings_balance.replace(" HIVE", "")) || 0;
      // const hbdBalance = parseFloat(user.hbd_balance.replace(" HBD", "")) || 0;
      const hbdSavings = parseFloat(user.savings_hbd_balance.replace(" HBD", "")) || 0;

      // 7️⃣ Mise à jour des champs
      document.getElementById("currentHP").value = hivePower.toFixed(2);
      document.getElementById("currentHBD").value = (hbdSavings).toFixed(2);
  } catch (error) {
      console.error("Error fetching Hive data:", error);
      alert("Failed to fetch Hive data.");
  }
}

document.getElementById("fetchHiveData").addEventListener("click", fetchHiveData);
