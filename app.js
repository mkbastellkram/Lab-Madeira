
async function loadCards(){
  const res = await fetch('./data/prs.json');
  const data = await res.json();
  const root = document.getElementById('cards');

  data.forEach(pr => {
    const card = document.createElement('article');
    card.className = 'card';

    card.innerHTML = `
      <div class="hero" style="background-image:url('${pr.image}')">
        <div class="overlay"></div>
        <div class="badge">${pr.id}</div>
        <div class="title">
          <h2>${pr.name}</h2>
        </div>
      </div>

      <div class="content">
        <div class="meta">
          <div class="pill">${pr.distance}</div>
          <div class="pill">${pr.difficulty}</div>
        </div>

        ${pr.warnings.map(w => `<div class="warn">⚠ ${w}</div>`).join('')}

        <div class="reward">Reward: ${pr.reward}</div>
      </div>
    `;

    root.appendChild(card);
  });
}

loadCards();
