
const app = document.getElementById("app");
const search = document.getElementById("search");
const sheetBackdrop = document.getElementById("sheetBackdrop");
const closeSheetBtn = document.getElementById("closeSheet");
let activeFilter = "";
let activeFeature = "";

function imgFor(t){
  if(t.image) return t.image;
  return `assets/img/${t.type || "forest"}.svg`;
}

function esc(s){
  return String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function render(){
  const q = search.value.trim().toLowerCase();
  app.innerHTML = "";
  const filtered = PR_TRAILS.filter(t => {
    const txt = [t.id,t.name,t.region,t.difficulty,t.dayType,t.signature,...t.reality,...t.nearby,...t.features].join(" ").toLowerCase();
    const okQ = !q || txt.includes(q);
    const okDiff = !activeFilter || t.difficulty.toLowerCase().includes(activeFilter);
    const okFeat = !activeFeature || t.features.includes(activeFeature) || t.type === activeFeature;
    return okQ && okDiff && okFeat;
  });

  filtered.forEach(t => {
    const el = document.createElement("article");
    el.className = "card";
    el.onclick = () => openSheet(t.id);
    el.innerHTML = `
      <div class="hero" style="background-image:url('${imgFor(t)}')">
        <div class="badge">${esc(t.id)}</div>
        <button class="favorite" aria-label="Favorit" onclick="event.stopPropagation();this.classList.toggle('on')">♡</button>
        <div class="hero-copy">
          <h2>${esc(t.name)}</h2>
          <p>${esc(t.signature)}</p>
        </div>
      </div>
      <div class="card-body">
        <div class="facts">
          <span class="pill">${esc(t.distance)}</span>
          <span class="pill">${esc(t.difficulty)}</span>
          <span class="pill">${esc(t.dayType)}</span>
        </div>
        <div class="warning-line">⚠ ${esc(t.reality.join(" · "))}</div>
        <div class="nearby-line">In der Nähe: ${esc(t.nearby.join(" · "))}</div>
      </div>
    `;
    app.appendChild(el);
  });
}

function openSheet(id){
  const t = PR_TRAILS.find(x => x.id === id);
  if(!t) return;
  document.getElementById("sheetHero").style.backgroundImage = `url('${imgFor(t)}')`;
  document.getElementById("sheetId").textContent = t.id;
  document.getElementById("sheetTitle").textContent = t.name;
  document.getElementById("sheetSignature").textContent = t.signature;
  document.getElementById("sheetDistance").textContent = t.distance;
  document.getElementById("sheetDifficulty").textContent = t.difficulty;
  document.getElementById("sheetStress").textContent = t.stress;
  document.getElementById("sheetDay").textContent = t.dayType;
  document.getElementById("sheetReality").innerHTML = t.reality.map(x => `<li>${esc(x)}</li>`).join("");
  document.getElementById("sheetNearby").innerHTML = t.nearby.map(x => `<li>${esc(x)}</li>`).join("");

  const fileLinks = [];
  if(t.files?.gpx) fileLinks.push(`<a href="${esc(t.files.gpx)}" download>GPX herunterladen</a>`);
  if(t.files?.kml) fileLinks.push(`<a href="${esc(t.files.kml)}" download>Anfahrt KML herunterladen</a>`);
  if(!fileLinks.length) fileLinks.push(`<span>Keine GPX/KML-Datei zugeordnet</span>`);
  document.getElementById("fileLinks").innerHTML = `<div class="file-list">${fileLinks.join("")}</div>`;

  document.getElementById("lnkGoogle").href = t.links.google;
  document.getElementById("lnkYoutube").href = t.links.youtube;
  document.getElementById("lnkInsta").href = t.links.instagram;
  document.getElementById("lnkKomoot").href = t.links.komoot_google;

  sheetBackdrop.classList.add("open");
  sheetBackdrop.setAttribute("aria-hidden","false");
}

function closeSheet(){
  sheetBackdrop.classList.remove("open");
  sheetBackdrop.setAttribute("aria-hidden","true");
}

search.addEventListener("input", render);
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter || "";
    activeFeature = chip.dataset.feature || "";
    render();
  });
});
document.getElementById("viewToggle").addEventListener("click", () => app.classList.toggle("compact"));
closeSheetBtn.addEventListener("click", closeSheet);
sheetBackdrop.addEventListener("click", e => { if(e.target === sheetBackdrop) closeSheet(); });
render();
