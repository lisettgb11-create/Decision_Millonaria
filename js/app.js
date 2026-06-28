const STORAGE_KEY = "decisionMillonaria";

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  return { ingresos: [], gastos: [], deudas: [], metas: [] };
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function formatMoney(n) {
  return "$" + Number(n).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

let data = loadData();

function render() {
  renderIngresos();
  renderGastos();
  renderDeudas();
  renderMetas();
  renderResumen();
  saveData();
}

function renderIngresos() {
  const ul = document.getElementById("listaIngresos");
  ul.innerHTML = "";
  data.ingresos.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="item-info"><span>${item.nombre}</span></div>
      <div>
        <span class="item-amount">${formatMoney(item.monto)}</span>
        <button class="delete-btn" data-type="ingresos" data-index="${i}">✕</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

function renderGastos() {
  const ul = document.getElementById("listaGastos");
  ul.innerHTML = "";
  data.gastos.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="item-info"><span>${item.nombre}</span></div>
      <div>
        <span class="item-amount">${formatMoney(item.monto)}</span>
        <button class="delete-btn" data-type="gastos" data-index="${i}">✕</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

function renderDeudas() {
  const ul = document.getElementById("listaDeudas");
  ul.innerHTML = "";
  data.deudas.forEach((item, i) => {
    const li = document.createElement("li");
    const tasaTexto = item.tasa ? ` · ${item.tasa}% interés` : "";
    li.innerHTML = `
      <div class="item-info">
        <span>${item.nombre}</span>
        <span class="item-sub">${tasaTexto}</span>
      </div>
      <div>
        <span class="item-amount">${formatMoney(item.monto)}</span>
        <button class="delete-btn" data-type="deudas" data-index="${i}">✕</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

function renderMetas() {
  const ul = document.getElementById("listaMetas");
  ul.innerHTML = "";
  data.metas.forEach((item, i) => {
    const pct = item.objetivo > 0 ? Math.min(100, (item.actual / item.objetivo) * 100) : 0;
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="item-info" style="flex:1">
        <span>${item.nombre}</span>
        <span class="item-sub">${formatMoney(item.actual)} de ${formatMoney(item.objetivo)} (${pct.toFixed(0)}%)</span>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      <button class="delete-btn" data-type="metas" data-index="${i}">✕</button>
    `;
    ul.appendChild(li);
  });
}

function renderResumen() {
  const totalIngresos = data.ingresos.reduce((s, i) => s + Number(i.monto), 0);
  const totalGastos = data.gastos.reduce((s, i) => s + Number(i.monto), 0);
  const totalDeudas = data.deudas.reduce((s, i) => s + Number(i.monto), 0);
  const totalAhorrado = data.metas.reduce((s, i) => s + Number(i.actual), 0);
  const balance = totalIngresos - totalGastos;
  const patrimonio = totalAhorrado - totalDeudas;

  document.getElementById("totalIngresos").textContent = formatMoney(totalIngresos);
  document.getElementById("totalGastos").textContent = formatMoney(totalGastos);
  document.getElementById("balanceMensual").textContent = formatMoney(balance);
  document.getElementById("totalDeudas").textContent = formatMoney(totalDeudas);
  document.getElementById("patrimonioNeto").textContent = formatMoney(patrimonio);
}

document.getElementById("formIngresos").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("ingresoNombre").value.trim();
  const monto = parseFloat(document.getElementById("ingresoMonto").value);
  data.ingresos.push({ nombre, monto });
  e.target.reset();
  render();
});

document.getElementById("formGastos").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("gastoNombre").value.trim();
  const monto = parseFloat(document.getElementById("gastoMonto").value);
  data.gastos.push({ nombre, monto });
  e.target.reset();
  render();
});

document.getElementById("formDeudas").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("deudaNombre").value.trim();
  const monto = parseFloat(document.getElementById("deudaMonto").value);
  const tasaInput = document.getElementById("deudaTasa").value;
  const tasa = tasaInput ? parseFloat(tasaInput) : null;
  data.deudas.push({ nombre, monto, tasa });
  e.target.reset();
  render();
});

document.getElementById("formMetas").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("metaNombre").value.trim();
  const objetivo = parseFloat(document.getElementById("metaObjetivo").value);
  const actual = parseFloat(document.getElementById("metaActual").value);
  data.metas.push({ nombre, objetivo, actual });
  e.target.reset();
  render();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const tipo = e.target.dataset.type;
    const index = Number(e.target.dataset.index);
    data[tipo].splice(index, 1);
    render();
  }
});

document.getElementById("btnReset").addEventListener("click", () => {
  if (confirm("¿Seguro que quieres borrar todos los datos? Esta acción no se puede deshacer.")) {
    data = { ingresos: [], gastos: [], deudas: [], metas: [] };
    render();
  }
});

render();
