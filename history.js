import { getPassportsHistory, resetPassportCounter } from "./storage.js";

let allPassports = [];

document.addEventListener("DOMContentLoaded", () => {
  loadHistory(); // загрузка истории
});

function loadHistory() {
  allPassports = getPassportsHistory();
  renderTable(allPassports);
}

// отрисовка таблицы паспортов
function renderTable(passports) {
  const tbody = document.getElementById("historyTableBody");
  const noData = document.getElementById("noData");
  const table = document.getElementById("historyTable");

  if (passports.length === 0) {
    noData.style.display = "block";
    table.style.display = "none";
    return;
  }

  noData.style.display = "none";
  table.style.display = "table";

  // сортировка для отображения новых паспортов сверху таблицы
  const sorted = [...passports].reverse();

  tbody.innerHTML = sorted.map(passport => `
    <tr>
      <td><strong>${passport.passportNumber}</strong></td>
      <td>${passport.issueDate}</td>
      <td>${passport.toolName}</td>
      <td><code>${passport.catalogCode}</code></td>
      <td>${passport.issuedTo}</td>
      <td>${passport.warehouse}</td>
      <td>
        <button onclick="reprintPassport('${passport.passportNumber}')" class="btn-small">
          Печать
        </button>
      </td>
    </tr>
  `).join("");
}

// функция поиска/фильтрации
window.filterHistory = function() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
  
  if (!searchTerm) {
    renderTable(allPassports);
    return;
  }

  const filtered = allPassports.filter(passport => {
    const passportNum = String(passport.passportNumber).toLowerCase();
    const issuedTo = String(passport.issuedTo).toLowerCase();
    const toolName = String(passport.toolName).toLowerCase();
    const catalogCode = String(passport.catalogCode).toLowerCase();
    
    return passportNum.includes(searchTerm) ||
           issuedTo.includes(searchTerm) ||
           toolName.includes(searchTerm) ||
           catalogCode.includes(searchTerm);
  });

  renderTable(filtered);
}

// функция повторной печати паспорта
window.reprintPassport = function(passportNumber) {
  const passport = allPassports.find(p => String(p.passportNumber) === String(passportNumber));
  
  if (!passport) {
    alert(`Паспорт №${passportNumber} не найден!\n\nВсего записей: ${allPassports.length}`);
    return;
  }

  localStorage.setItem("currentIssue", JSON.stringify(passport));
  
  const reportWindow = window.open("report.html", "_blank");
  if (reportWindow) {
    reportWindow.focus();
  }
};

// очистка истории
window.clearHistory = function() {
  const count = allPassports.length;
  
  if (count === 0) {
    alert("История уже пуста!");
    return;
  }

  if (confirm(`Вы уверены, что хотите удалить все ${count} записей?\n\nЭто действие нельзя отменить!\n\nСчетчик паспортов также будет сброшен.`)) {
    if (confirm("Последнее предупреждение! Продолжить?")) {
      localStorage.removeItem("passportsHistory");
      resetPassportCounter(); // Сбрасываем счетчик на 1
      allPassports = [];
      renderTable([]);
      alert("История очищена!\nСчетчик паспортов сброшен на 1");
    }
  }
};