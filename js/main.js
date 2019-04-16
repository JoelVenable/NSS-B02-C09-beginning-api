
fetch("http://localhost:8088/food")
  .then(foods => foods.json())
  .then(parsedFoods => {
    parsedFoods.forEach(food => {
      addFoodToDom(foodFactory(food))
    })
  })














function foodFactory(foodItem) {
  return `<div>
            <h2>${foodItem.name}</h2>
          <p>Category: ${foodItem.category}</p>
          <p>Ethnicity: ${foodItem.ethnicity}</p>
          </div>`

}

function addFoodToDom(htmlString) {
  const div = document.querySelector('#container')
  div.innerHTML += htmlString;
}


const dataBtn = document.getElementById('btn-get-data')
dataBtn.addEventListener("click", getData);