const appId = '9c47b56c'; // Replace with your Nutritionix App ID
const appKey = '63e8458fa8275d2f2611236a4316ce6a'; // Replace with your Nutritionix App Key

document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const icon = darkModeToggle.querySelector('i');
  
  // Check for saved theme preference or default to 'light'
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateIcon(savedTheme === 'dark');

  darkModeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(!isDark);
  });
});

function updateIcon(isDark) {
  const icon = document.querySelector('.theme-toggle i');
  icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
}

document.getElementById('foodForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get user input
  const foodItem = document.getElementById('foodItem').value;

  // Validate input
  if (!foodItem) {
    alert('Please enter a food item.');
    return;
  }

  // Search for nutritional information
  searchNutritionInfo(foodItem);
});

function searchNutritionInfo(foodItem) {
  const url = `https://trackapi.nutritionix.com/v2/natural/nutrients`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': appId,
      'x-app-key': appKey,
    },
    body: JSON.stringify({
      query: foodItem,
    }),
  };

  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      console.log(data); // Check the API response in the console
      displayNutritionInfo(data.foods[0]);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to fetch nutritional information. Please try again later.');
    });
}

function displayNutritionInfo(food) {
  const nutritionInfoDiv = document.getElementById('nutritionInfo');
  nutritionInfoDiv.innerHTML = '';

  if (food) {
    nutritionInfoDiv.innerHTML = `
      <h3>${food.food_name}</h3>
      <p><strong>Calories:</strong> ${food.nf_calories} kcal</p>
      <p><strong>Protein:</strong> ${food.nf_protein} g</p>
      <p><strong>Carbohydrates:</strong> ${food.nf_total_carbohydrate} g</p>
      <p><strong>Fat:</strong> ${food.nf_total_fat} g</p>
      <p><strong>Serving Size:</strong> ${food.serving_qty} ${food.serving_unit}</p>
    `;
  } else {
    nutritionInfoDiv.innerHTML = '<p>No nutritional information found. Please try another food item.</p>';
  }
}