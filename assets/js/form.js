let aside = document.querySelector("aside");
let xmark = document.querySelector("#xmark");
let menu = document.querySelector("#menu");

menu.addEventListener("click", function () {
  console.log("ss");
  aside.classList.toggle("show");
});
xmark.addEventListener("click", function () {
  aside.classList.toggle("show");
});
// ===============================================

let form = document.querySelector("form");
let allInputs = document.querySelectorAll("input");
let tBody = document.querySelector("tbody");
let search = document.querySelector(".search");
let sort = document.querySelector(".sort");
let BASE_URL = "http://localhost:8080";
let editId = null;
let dataCopy = [];
let sortedCopy = [];
async function getData() {
  let res = await axios(`${BASE_URL}/products`);
  let data = res.data;
  dataCopy = data;
  sortedCopy = structuredClone(data);
  drawtable(data);
}
getData();

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let obj = {
    name: allInputs[0].value,
    price: allInputs[1].value,
    imgUrl: `./assets/img/${allInputs[2].value.split("\\")[2]}`,
  };
  if (!editId) {
    if (allInputs[0].value && allInputs[1].value && allInputs[2].value) {
      addToProduct(obj);
      alert("Added product");
    } else {
      alert("you should fulled!");
    }
  } else {
    async function updata(obj) {
      await axios.patch(`${BASE_URL}/products/${editId}`, obj);
    }
    updata(obj);
  }

  allInputs.forEach((item) => (item.value = ""));
});

function drawtable(data) {
  tBody.innerHTML = "";
  data.forEach((element) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${element.id}</td>
        <td><img src="${element.imgUrl}"></td>
        <td>${element.name}</td>
        <td>${element.price}</td>
        <td><i onclick=deleteToData("${element.id}",this) class="fa-regular fa-trash-can"></i>
            <i onclick=updateToData("${element.id}",this) class="fa-regular fa-pen-to-square"></i>
        </td>
    `;
    tBody.append(tr);
  });
}
async function addToProduct(obj) {
  await axios.post(`${BASE_URL}/products`, obj);
}
let basket = getdataFromLocaleBasket();

async function deleteToData(id, btn) {
  await axios.delete(`${BASE_URL}/products/${id}`);
  btn.closest("tr").remove();
  basket = basket.filter((item) => item.product.id !== id);
  setDataTOLocaleBasket(basket);
}

function setDataTOLocaleBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}
function getdataFromLocaleBasket() {
  return JSON.parse(localStorage.getItem("basket")) || [];
}
async function updateToData(id, btn) {
  editId = id;
  let res = await axios(`${BASE_URL}/products/${id}`);
  allInputs[0].value = res.data.name;
  allInputs[1].value = res.data.price;
}

sort.addEventListener("click", function () {
  let sorted;
  if (sort.textContent === "SORT") {
    sort.textContent = "DECREMENT";
    sorted = dataCopy.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort.textContent === "DECREMENT") {
    sort.textContent = "INCREMENT";
    sorted = dataCopy.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    sort.textContent = "SORT";
    sorted = sortedCopy;
  }
  drawtable(sorted);
});

search.addEventListener("input", function (e) {
  let filtered = dataCopy.filter((item) =>
    item.name.toLocaleLowerCase().includes(e.target.value)
  );
  drawtable(filtered);
});
