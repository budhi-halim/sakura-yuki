async function init() {
  const response = await fetch('./data.json');
  const { compositions } = await response.json();

  const select = document.getElementById('composition-select');
  const outputBox = document.getElementById('prompt-output');

  // Populate Select elements AFTER the <button> tag
  compositions.forEach((comp, index) => {
    const opt = document.createElement('option');
    opt.value = index;
    opt.textContent = comp.name;
    select.appendChild(opt);
  });

  select.addEventListener('change', (e) => {
    const comp = compositions[e.target.value];
    outputBox.textContent = generateRawPrompt(comp);
    outputBox.classList.add('generated-text');
  });

  // Copy Logic
  const copyBtn = document.querySelector('.copy-btn');
  copyBtn.addEventListener('click', () => handleCopy(copyBtn));
}

function generateRawPrompt(comp) {
  const clothingOptions = comp.clothing && comp.clothing.length > 0 
    ? `[${comp.clothing.join(', or ')}]` 
    : "default outfit";

  const poseOptions = comp.poses && comp.poses.length > 0 
    ? `[${comp.poses.join(', or ')}]` 
    : "default pose";

  return `
Clothing: ${clothingOptions}
Poses: ${poseOptions}
Scene/environment/background: ${comp.environment}
Lighting: ${comp.lighting}`.trim();
}

async function handleCopy(btn) {
  const targetId = btn.getAttribute('data-target');
  const text = document.getElementById(targetId).textContent;

  if (text === "Awaiting selection...") return;

  await navigator.clipboard.writeText(text);

  const copyIcon = btn.querySelector('.icon-copy');
  const checkIcon = btn.querySelector('.icon-check');

  copyIcon.classList.add('hidden-icon');
  checkIcon.classList.remove('hidden-icon');

  setTimeout(() => {
    copyIcon.classList.remove('hidden-icon');
    checkIcon.classList.add('hidden-icon');
  }, 2000);
}

document.addEventListener('DOMContentLoaded', init);