let themesData = [];

async function init() {
  const response = await fetch('./data.json');
  const data = await response.json();
  themesData = data.themes;

  const themeSelect = document.getElementById('theme-select');
  const variationSelect = document.getElementById('variation-select');
  
  // 1. Populate Theme Dropdown with numbering
  themesData.forEach((theme, index) => {
    const opt = document.createElement('option');
    opt.value = index;
    opt.textContent = `${index + 1}. ${theme.name}`;
    themeSelect.appendChild(opt);
  });

  // 2. Handle Theme Selection
  themeSelect.addEventListener('change', (e) => {
    const selectedTheme = themesData[e.target.value];
    
    // Enable variation dropdown
    variationSelect.disabled = false;
    
    // Safely clear existing dynamic options without overwriting innerHTML 
    // to preserve the experimental <button><selectedcontent> binding.
    // The first option (index 0) is the placeholder, so we keep it and remove the rest.
    variationSelect.options.length = 1; 
    variationSelect.options[0].textContent = "— Choose a Variation —";
    variationSelect.options[0].selected = true;

    // Populate variations
    selectedTheme.variations.forEach((variation, vIndex) => {
      const opt = document.createElement('option');
      opt.value = vIndex;
      opt.textContent = variation.name;
      variationSelect.appendChild(opt);
    });

    // Reset output box until a variation is selected
    document.getElementById('prompt-output').textContent = "Awaiting variation selection...";
    document.getElementById('prompt-output').classList.remove('generated-text');
  });

  // 3. Handle Variation Selection
  variationSelect.addEventListener('change', (e) => {
    const themeIndex = themeSelect.value;
    const variationIndex = e.target.value;
    
    // Safety check just in case the placeholder is clicked
    if (variationIndex === "") return; 

    const selectedVariation = themesData[themeIndex].variations[variationIndex];
    
    const outputBox = document.getElementById('prompt-output');
    outputBox.textContent = selectedVariation.prompt;
    outputBox.classList.add('generated-text');
  });

  // 4. Attach Copy Logic to all copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => handleCopy(btn));
  });
}

async function handleCopy(btn) {
  const targetId = btn.getAttribute('data-target');
  const targetType = btn.getAttribute('data-type'); // 'select' or 'text'
  const targetElement = document.getElementById(targetId);
  
  let textToCopy = "";

  if (targetType === 'select') {
    // If nothing valid is selected (like the disabled placeholder), do nothing
    if (targetElement.selectedIndex <= 0) return;
    
    textToCopy = targetElement.options[targetElement.selectedIndex].text;
    
    // If it's the theme select, strip the numbering (e.g., "1. Rooftop..." -> "Rooftop...")
    if (targetId === 'theme-select') {
      textToCopy = textToCopy.replace(/^\d+\.\s*/, '');
    }
  } else {
    textToCopy = targetElement.textContent;
    if (textToCopy === "Awaiting selection..." || textToCopy === "Awaiting variation selection...") return;
  }

  await navigator.clipboard.writeText(textToCopy);

  // Icon swap for visual feedback
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