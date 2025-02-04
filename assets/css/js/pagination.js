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
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('nb-btn');
        pageButton.onclick = () => showPage(i);
        pagination.appendChild(pageButton);
      }
    }
  
    showPage(1);
  }
  