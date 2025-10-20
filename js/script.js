// Initialisation AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true
});

// Eléments du DOM
const bmiForm = document.getElementById('bmiForm');
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const resetBtn = document.getElementById('resetBtn');
const resultContainer = document.getElementById('resultContainer');
const bmiValue = document.getElementById('bmiValue');
const bmiCategory = document.getElementById('bmiCategory');
const bmiDescription = document.getElementById('bmiDescription');
const bmiProgress = document.getElementById('bmiProgress');
const healthyRangeText = document.getElementById('healthyRangeText');
const healthyRangeContainer = document.getElementById('healthyRangeContainer');

// Calcul de l'IMC
bmiForm.addEventListener('submit', function(e) {
  e.preventDefault();

  if (validateInputs()) {
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);
    const bmi = calculateBMI(weight, height);
    const category = getBMICategory(bmi);
    const description = getBMIDescription(category);

    displayResult(bmi, category, description, height);
  }
});

// Réinitialiser le formulaire
resetBtn.addEventListener('click', function() {
  resetForm();
});

// Validation des champs
function validateInputs() {
  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value);
  let isValid = true;

  // Effacer les messages d'erreur précédents
  document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
  weightInput.classList.remove('is-invalid');
  heightInput.classList.remove('is-invalid');

  // Valider le poids
  if (isNaN(weight)) {
    showError(weightInput, 'Veuillez saisir un poids valide');
    isValid = false;
  } else if (weight < 30 || weight > 300) {
    showError(weightInput, 'Veuillez entrer un poids entre 30kg et 300kg');
    isValid = false;
  }

  // Valider la taille
  if (isNaN(height)) {
    showError(heightInput, 'Veuillez saisir une taille valide');
    isValid = false;
  } else if (height < 0.5 || height > 2.5) {
    showError(heightInput, 'Veuillez entrer une taille entre 0,5m et 2,5m');
    isValid = false;
  }

  return isValid;
}

function showError(input, message) {
  input.classList.add('is-invalid');
  const div = document.createElement('div');
  div.className = 'invalid-feedback';
  div.textContent = message;
  input.parentNode.appendChild(div);
}

// Calcul de l'IMC (arrondi à 1 décimale)
function calculateBMI(weight, height) {
  const raw = weight / (height * height);
  return Number(raw.toFixed(1));
}

// Catégorie d'IMC
function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return 'Insuffisance pondérale';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return 'Poids normal';
  } else if (bmi >= 25 && bmi <= 29.9) {
    return 'Surpoids';
  } else {
    return 'Obésité';
  }
}

// Description selon la catégorie
function getBMIDescription(category) {
  switch (category) {
    case 'Insuffisance pondérale':
      return 'Vous êtes en insuffisance pondérale. Envisagez de consulter un professionnel de santé pour un plan d&#39;augmentation de poids sain.';
    case 'Poids normal':
      return 'Félicitations ! Votre poids est dans la fourchette saine. Maintenez une alimentation équilibrée et une activité physique régulière.';
    case 'Surpoids':
      return 'Vous êtes en surpoids. Envisagez d’adopter un mode de vie plus sain avec une alimentation équilibrée et de l’exercice régulier.';
    case 'Obésité':
      return 'Vous êtes dans la catégorie d’obésité. Il est recommandé de consulter un professionnel de santé pour un plan personnalisé.';
    default:
      return '';
  }
}

// Afficher le résultat
function displayResult(bmi, category, description, height) {
  bmiValue.textContent = bmi.toFixed(1);
  bmiCategory.textContent = category;
  bmiDescription.textContent = description;

  // Mettre à jour la barre de progression
  updateProgressBar(bmi);

  // Calculer et afficher la fourchette de poids sain
  const healthyMin = (18.5 * (height * height)).toFixed(1);
  const healthyMax = (24.9 * (height * height)).toFixed(1);
  healthyRangeText.innerHTML = `
    <strong>Fourchette de poids saine pour votre taille (${height} m) :</strong><br>
    ${healthyMin} kg - ${healthyMax} kg
  `;

  // Style en fonction de la catégorie
  bmiCategory.className = 'mt-2';
  healthyRangeContainer.className = 'healthy-range mt-3';

  switch (category) {
    case 'Insuffisance pondérale':
      bmiCategory.classList.add('text-primary');
      healthyRangeContainer.classList.add('bg-primary', 'bg-opacity-10');
      break;
    case 'Poids normal':
      bmiCategory.classList.add('text-success');
      healthyRangeContainer.classList.add('bg-success', 'bg-opacity-10');
      break;
    case 'Surpoids':
      bmiCategory.classList.add('text-warning');
      healthyRangeContainer.classList.add('bg-warning', 'bg-opacity-10');
      break;
    case 'Obésité':
      bmiCategory.classList.add('text-danger');
      healthyRangeContainer.classList.add('bg-danger', 'bg-opacity-10');
      break;
  }

  resultContainer.classList.remove('d-none');
  resultContainer.classList.add('has-result');

  // Rafraîchir AOS pour les animations
  AOS.refresh();

  // Faire défiler jusqu'au résultat
  resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// Mettre à jour la barre de progression en fonction de l'IMC
function updateProgressBar(bmi) {
  let progressWidth = 0;
  let progressColor = '';

  if (bmi < 18.5) {
    progressWidth = (bmi / 18.5) * 25;
    progressColor = '#0d6efd'; // Bleu
  } else if (bmi <= 24.9) {
    progressWidth = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 50;
    progressColor = '#1D809F'; // Vert principal adapté
  } else if (bmi <= 29.9) {
    progressWidth = 75 + ((bmi - 25) / (29.9 - 25)) * 15;
    progressColor = '#ffc107'; // Jaune
  } else {
    progressWidth = 90 + (Math.min(bmi - 30, 20) / 20) * 10;
    progressColor = '#dc3545'; // Rouge
  }

  // Limiter à 100%
  progressWidth = Math.min(progressWidth, 100);

  bmiProgress.style.width = `${progressWidth}%`;
  bmiProgress.style.backgroundColor = progressColor;
  bmiProgress.setAttribute('aria-valuenow', progressWidth);
}

// Réinitialiser le formulaire
function resetForm() {
  bmiForm.reset();
  resultContainer.classList.add('d-none');
  resultContainer.classList.remove('has-result');
  bmiValue.textContent = '-';
  bmiCategory.textContent = '-';
  bmiDescription.textContent = '-';
  bmiCategory.className = 'mt-2';
  bmiProgress.style.width = '0%';
  healthyRangeText.textContent = '';

  // Effacer les erreurs de validation
  document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
  weightInput.classList.remove('is-invalid');
  heightInput.classList.remove('is-invalid');
}