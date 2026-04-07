/**
 * SEO Agent Builder — palette modules and pipeline state
 */

const MODULES = [
  {
    id: "keyword",
    name: "Keyword intel",
    desc: "Volume, intent, SERP features",
    emoji: "🔎",
    color: "#60a5fa",
  },
  {
    id: "technical",
    name: "Technical audit",
    desc: "Crawl, CWV, indexation",
    emoji: "⚙️",
    color: "#f5b84a",
  },
  {
    id: "content",
    name: "Content brief",
    desc: "Outlines, entities, FAQs",
    emoji: "📝",
    color: "#a78bfa",
  },
  {
    id: "links",
    name: "Link & entity graph",
    desc: "Internal links, anchors",
    emoji: "🔗",
    color: "#34d399",
  },
  {
    id: "local",
    name: "Local & schema",
    desc: "NAP, GBP, JSON-LD",
    emoji: "📍",
    color: "#fb7185",
  },
  {
    id: "report",
    name: "Stakeholder report",
    desc: "KPIs, actions, exports",
    emoji: "📊",
    color: "#3ee8b5",
  },
];

const paletteEl = document.getElementById("module-palette");
const pipelineEl = document.getElementById("pipeline");
const vizNodesEl = document.getElementById("viz-nodes");
const vizEdgesEl = document.getElementById("viz-edges");
const summaryEl = document.getElementById("summary");
const btnClear = document.getElementById("btn-clear");

/** @type {typeof MODULES[number][]} */
let pipeline = [];

function moduleById(id) {
  return MODULES.find((m) => m.id === id);
}

function renderPalette() {
  paletteEl.innerHTML = "";
  for (const m of MODULES) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "module-btn";
    btn.setAttribute("data-id", m.id);
    btn.innerHTML = `
      <span class="module-icon" style="background:${m.color}22;color:${m.color}">${m.emoji}</span>
      <span>
        <strong>${escapeHtml(m.name)}</strong>
        <span class="desc">${escapeHtml(m.desc)}</span>
      </span>
    `;
    btn.addEventListener("click", () => addToPipeline(m.id));
    li.appendChild(btn);
    paletteEl.appendChild(li);
  }
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function addToPipeline(id) {
  const m = moduleById(id);
  if (!m) return;
  pipeline = [...pipeline, m];
  render();
}

function removeAt(index) {
  pipeline = pipeline.filter((_, i) => i !== index);
  render();
}

function clearPipeline() {
  pipeline = [];
  render();
}

function renderPipeline() {
  pipelineEl.innerHTML = "";
  pipelineEl.classList.toggle("has-items", pipeline.length > 0);

  pipeline.forEach((m, i) => {
    const row = document.createElement("div");
    row.className = "pipeline-item";
    row.setAttribute("role", "listitem");
    row.innerHTML = `
      <span class="idx">${String(i + 1).padStart(2, "0")}</span>
      <span class="name">${escapeHtml(m.emoji)} ${escapeHtml(m.name)}</span>
      <button type="button" class="remove" aria-label="Remove ${escapeHtml(m.name)}">×</button>
    `;
    row.querySelector(".remove").addEventListener("click", () => removeAt(i));
    pipelineEl.appendChild(row);
  });
}

function drawEdges() {
  vizEdgesEl.innerHTML = "";
  const nodes = vizNodesEl.querySelectorAll(".viz-node");
  if (nodes.length < 2) return;

  const svg = vizEdgesEl;
  const rect = vizEdgesEl.getBoundingClientRect();
  const host = vizEdgesEl.parentElement.getBoundingClientRect();

  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i].getBoundingClientRect();
    const b = nodes[i + 1].getBoundingClientRect();
    const x1 = a.left + a.width / 2 - host.left;
    const y1 = a.top + a.height / 2 - host.top;
    const x2 = b.left + b.width / 2 - host.left;
    const y2 = b.top + b.height / 2 - host.top;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(x1));
    line.setAttribute("y1", String(y1));
    line.setAttribute("x2", String(x2));
    line.setAttribute("y2", String(y2));
    line.setAttribute("stroke", "rgba(62, 232, 181, 0.45)");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("stroke-linecap", "round");
    svg.appendChild(line);

    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const s = 6;
    const bx = mx - ux * s;
    const by = my - uy * s;
    const perp = [-uy, ux];
    arrow.setAttribute(
      "points",
      `${mx},${my} ${bx + perp[0] * 4},${by + perp[1] * 4} ${bx - perp[0] * 4},${by - perp[1] * 4}`
    );
    arrow.setAttribute("fill", "rgba(62, 232, 181, 0.7)");
    svg.appendChild(arrow);
  }

}

function renderViz() {
  vizNodesEl.innerHTML = "";
  if (pipeline.length === 0) {
    summaryEl.innerHTML = "";
    return;
  }

  for (const m of pipeline) {
    const div = document.createElement("div");
    div.className = "viz-node";
    div.style.borderColor = `${m.color}55`;
    div.innerHTML = `<span class="emoji">${m.emoji}</span><span>${escapeHtml(m.name)}</span>`;
    vizNodesEl.appendChild(div);
  }

  requestAnimationFrame(() => {
    drawEdges();
  });

  const stages = pipeline.length;
  const coverage = new Set(pipeline.map((p) => p.id)).size;
  const hasReport = pipeline.some((p) => p.id === "report");

  summaryEl.innerHTML = `
    <dt>Stages</dt><dd>${stages} agent step${stages === 1 ? "" : "s"}</dd>
    <dt>Module coverage</dt><dd>${coverage} unique capability type${coverage === 1 ? "" : "s"}</dd>
    <dt>Reporting</dt><dd>${hasReport ? "Included — good for handoff" : "Add “Stakeholder report” for exports"}</dd>
  `;
}

function render() {
  renderPipeline();
  renderViz();
}

btnClear.addEventListener("click", clearPipeline);

window.addEventListener("resize", () => {
  if (pipeline.length > 1) drawEdges();
});

renderPalette();
render();
