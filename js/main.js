function getData() {
  fetch("http://localhost:8088/food")
    .then(foods => foods.json())
    .then(parsedFoods => {
      parsedFoods.forEach(food => {
        getFoodInfo(food.barcode)
          .then(foodData => {

            console.table(foodData);

            console.log(foodData.ingredients)
            let foodHtml = foodFactory(food, foodData);
            addFoodToDom(foodHtml);
        });
      });
    });
}

function getFoodInfo(barcode) {
  return fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    .then(response => response.json())
    .then(foodInfo => {
      return {
        ingredients: foodInfo.product.ingredients,
        country: foodInfo.product.countries,
        calories: {
          energy: foodInfo.product.nutriments.energy,
          energyUnit: foodInfo.product.nutriments.energy_unit
        },
        fat: {
          value: foodInfo.product.nutriments.fat_value,
          unit: foodInfo.product.nutriments.fat_unit
        },
        sugar: {
          value: foodInfo.product.nutriments.sugars_value,
          unit: foodInfo.product.nutriments.sugars_unit
        }
      };
    });
}

function foodFactory(foodItem, foodData) {
  return `<div class="food-item" id="${foodItem.name}">
            <h2>${foodItem.name}</h2>
            <p>Category: ${foodItem.category}</p>
            <p>Ethnicity: ${foodItem.ethnicity}</p>
            <p>Ingredients:</p>
            <ul>${makeIngredientList(foodData.ingredients)}</ul>
          </div>`;

}


function makeIngredientList(ingredientList) {
  console.log('hello from makeIngredientList')
  let list = '';
  ingredientList.forEach(ingredient => {
    list += `<li>${ingredient.name}</li>`
  })
  return list;
}

function addFoodToDom(htmlString) {
  const div = document.querySelector("#container");
  div.innerHTML += htmlString;
}

const dataBtn = document.getElementById("btn-get-data");
console.log(dataBtn);
dataBtn.addEventListener("click", getData);
