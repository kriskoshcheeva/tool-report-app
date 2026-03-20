// Ключ для хранения массива инструментов
const TOOLS_KEY = "tools";

// Ключ для хранения счётчика номеров паспортов
const PASSPORT_KEY = "passportCounter";

// Ключ для хранения истории выданных паспортов
const PASSPORTS_HISTORY_KEY = "passportsHistory";

// функция инициализации хранилища
export function initStorage(forceReset = false) {
  const existingTools = localStorage.getItem(TOOLS_KEY);
  
  if (forceReset || !existingTools) {
    const sampleTools = [
      { id: 1, name: "Фреза твердосплавная D=8,00", catalogCode: "G14FS0800XL", edges: 4, individualCode: "518400021-230100090" },
      { id: 2, name: "Фреза концевая D=10,00", catalogCode: "G14FK1000", edges: 4, individualCode: "518400021-230100091" },
      { id: 3, name: "Фреза концевая D=6,00", catalogCode: "G14FK0600", edges: 4, individualCode: "518400021-230100092" },
      { id: 4, name: "Фреза концевая D=12,00", catalogCode: "G14FK1200", edges: 4, individualCode: "518400021-230100093" },
      { id: 5, name: "Сверло спиральное D=6,00", catalogCode: "G02D0600", edges: 2, individualCode: "518400021-230100094" },
      { id: 6, name: "Сверло спиральное D=8,00", catalogCode: "G02D0800", edges: 2, individualCode: "518400021-230100095" },
      { id: 7, name: "Сверло спиральное D=10,00", catalogCode: "G02D1000", edges: 2, individualCode: "518400021-230100096" },
      { id: 8, name: "Резец токарный проходной", catalogCode: "G05R2020", edges: 1, individualCode: "518400021-230100097" },
      { id: 9, name: "Резец токарный расточной", catalogCode: "G05R2525", edges: 1, individualCode: "518400021-230100098" },
      { id: 10, name: "Развёртка D=8,00", catalogCode: "G03R0800", edges: 6, individualCode: "518400021-230100099" },
      { id: 11, name: "Зенкер D=12,00", catalogCode: "G04Z1200", edges: 4, individualCode: "518400021-230100100" },
      { id: 12, name: "Метчик М8", catalogCode: "G06M0800", edges: 4, individualCode: "518400021-230100101" },
      { id: 13, name: "Метчик М10", catalogCode: "G06M1000", edges: 4, individualCode: "518400021-230100102" },
      { id: 14, name: "Плашка М8", catalogCode: "G07P0800", edges: 1, individualCode: "518400021-230100103" },
      { id: 15, name: "Фреза дисковая D=80", catalogCode: "G14FD0800", edges: 16, individualCode: "518400021-230100104" }
    ];
    // сохранение в localStorage
    localStorage.setItem(TOOLS_KEY, JSON.stringify(sampleTools));
  }
  
  // инициализация счетчика
  if (!localStorage.getItem(PASSPORT_KEY)) {
    localStorage.setItem(PASSPORT_KEY, "1");
  }
  
  // инициализация истории
  if (!localStorage.getItem(PASSPORTS_HISTORY_KEY)) {
    localStorage.setItem(PASSPORTS_HISTORY_KEY, "[]");
  }
}

// функция получения всех инструментов
export function getTools() {
  return JSON.parse(localStorage.getItem(TOOLS_KEY)) || [];
}

// получение по id
export function getToolById(id) {
  const tools = getTools();
  return tools.find(tool => tool.id === id);
}

// получает текущий номер БЕЗ увеличения
export function getCurrentPassportNumber() {
  return localStorage.getItem(PASSPORT_KEY) || "1";
}

// увеличивает счетчик и возвращает НОВЫЙ номер (для следующего паспорта)
export function getNextPassportNumber() {
  let current = localStorage.getItem(PASSPORT_KEY) || "1";
  const next = Number(current) + 1;
  localStorage.setItem(PASSPORT_KEY, String(next));
  return current;
}

// сбрасывает счетчик на 1
export function resetPassportCounter() {
  localStorage.setItem(PASSPORT_KEY, "1");
}

// сохранение в историю
export function savePassportToHistory(passportData) {
  const history = getPassportsHistory();
  history.push(passportData);
  localStorage.setItem(PASSPORTS_HISTORY_KEY, JSON.stringify(history));
}

// получение истории
export function getPassportsHistory() {
  const data = localStorage.getItem(PASSPORTS_HISTORY_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Ошибка парсинга истории:", e);
    return [];
  }
}

// найти паспорт по номеру
export function getPassportByNumber(number) {
  const history = getPassportsHistory();
  return history.find(p => String(p.passportNumber) === String(number));
}