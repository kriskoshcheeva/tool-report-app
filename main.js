import { initStorage, getTools, getToolById, getNextPassportNumber, savePassportToHistory } from "./storage.js";

initStorage();

// Выпадающий список для выбора инструмента
const toolSelect = document.getElementById("toolSelect");

// Контейнер для карточек инструментов
const toolCardsContainer = document.getElementById("toolCards");

// Форма оформления выдачи
const form = document.getElementById("issueForm");

// функция отрисовки карточек инструментов
function renderToolCards() {
  const tools = getTools();
  
  if (!toolCardsContainer) return;
  
  toolCardsContainer.innerHTML = tools.map(tool => `
    <div class="tool-card" data-id="${tool.id}">
      <h4>${tool.name}</h4>
      <p><strong>Шифр:</strong> ${tool.catalogCode}</p>
      <p><strong>Кромки:</strong> ${tool.edges}</p>
      <p><strong>ID:</strong> ${tool.individualCode}</p>
    </div>
  `).join("");
  
  document.querySelectorAll(".tool-card").forEach(card => {
    card.addEventListener("click", () => {
      const toolId = card.dataset.id;
      toolSelect.value = toolId;
      
      document.querySelectorAll(".tool-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
    });
  });
}

// функция заполнения выпадающего списка
function populateToolSelect() {
  const tools = getTools();
  
  if (!toolSelect) return;
  
  toolSelect.innerHTML = tools.map(tool => 
    `<option value="${tool.id}">${tool.name}</option>`
  ).join("");
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const toolId = toolSelect.value;
    const tool = getToolById(Number(toolId));
    
    if (!tool) {
      alert("Выберите инструмент из списка!");
      return;
    }

    // получаем номер паспорта (счетчик увеличивается)
    const passportNumber = getNextPassportNumber();
    
    const issueData = {
      passportNumber,
      toolId: Number(toolId),
      issuedTo: document.getElementById("issuedTo").value.trim(),
      warehouse: document.getElementById("warehouse").value.trim(),
      issueDate: new Date().toLocaleDateString("ru-RU"),
      toolName: tool.name,
      catalogCode: tool.catalogCode,
      edges: tool.edges,
      individualCode: tool.individualCode
    };

    // сохраняем в историю
    savePassportToHistory(issueData);
    
    // сохраняем для передачи на страницу отчета
    localStorage.setItem("currentIssue", JSON.stringify(issueData));
    
    const reportWindow = window.open(`report.html`, "_blank");
    if (reportWindow) {
      reportWindow.focus();
    }
  });
}

// запуск функций при загрузке
populateToolSelect();
renderToolCards();