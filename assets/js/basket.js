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


let tBody = document.querySelector("tbody");
let BASE_URL = "http://localhost:8080";

async function getData() {
  let res = await axios(`${BASE_URL}/products`);
  let data = res.data;
  drawtable(data);
}
getData();

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

