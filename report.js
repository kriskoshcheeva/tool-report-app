import { getCurrentPassportNumber } from "./storage.js";

document.addEventListener("DOMContentLoaded", () => {
  // получаем данные из localStorage
  const issueData = JSON.parse(localStorage.getItem("currentIssue"));
  
  if (!issueData) {
    document.body.innerHTML = "<h1 style='text-align:center;margin-top:50px;'>Нет данных для отображения паспорта</h1>";
    return;
  }

  // заполняем все поля данными из issueData
  document.getElementById("passportNumber").textContent = issueData.passportNumber;
  document.getElementById("passportDate").textContent = issueData.issueDate;
  document.getElementById("issuedTo").textContent = issueData.issuedTo;
  document.getElementById("warehouse").textContent = issueData.warehouse;
  document.getElementById("toolName").textContent = issueData.toolName;
  document.getElementById("catalogCode").textContent = issueData.catalogCode;
  document.getElementById("edges").textContent = issueData.edges;
  document.getElementById("individualCode").textContent = issueData.individualCode;

  // генерируем штрихкод
  JsBarcode("#barcode", issueData.individualCode, {
    format: "CODE128",
    displayValue: true,
    fontSize: 14,
    margin: 5,
    height: 40
  });

  // автопечать через 500мс
  setTimeout(() => {
    window.print();
  }, 500);
});