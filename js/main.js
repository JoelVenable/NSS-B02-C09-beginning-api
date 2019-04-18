const API = {
  local: "http://localhost:8088/food",
  remote(barcode) {
    return `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  },
  getData(url) {
    return fetch(url).then(object => object.json());
  }
};

function getFoodInfo() {
  API.getData(API.local).then(foods => processFoods(foods));

  function processFoods(foods) {
    foods.forEach(food => {
      getExternalFoodInfo(food.barcode).then(foodData => {
        let foodHtml = foodFactory(food, foodData);
        addFoodToDom(foodHtml);
      });
    });
  }


  function getExternalFoodInfo(barcode) {
    return API.getData(API.remote(barcode)).then(foodInfo => {

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

}



function foodFactory(foodItem, foodData) {


  function makeIngredientList(ingredientList) {
    let list = "";
    ingredientList.forEach(ingredient => {
      list += `<li>${ingredient.text}</li>`;
    });
    return list;
  }

  console.log(foodItem)
  return `<div class="food-item" id="${foodItem.name}">
            <h2>${foodItem.name}</h2>
            <p>Category: ${foodItem.category}</p>
            <p>Ethnicity: ${foodItem.ethnicity}</p>
            <p>Fat: ${foodData.fat.value} ${foodData.fat.unit}</p>
            <p>Sugar: ${foodData.sugar.value} ${foodData.sugar.unit}</p>
            <p>Ingredients:</p>
            <ul>${makeIngredientList(foodData.ingredients)}</ul>
          </div>`;
}



function addFoodToDom(htmlString) {
  const div = document.querySelector("#container");
  div.innerHTML += htmlString;
}

const dataBtn = document.getElementById("btn-get-data");
dataBtn.addEventListener("click", getFoodInfo);
