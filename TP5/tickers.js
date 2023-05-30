"use strict";

window.onload = () => {
  let refreshButton = document.getElementById("refreshButton");
  let stockTable = document.getElementById("stockTable");
  let markText = document.getElementById("markText");
  
  refreshButton.onclick = () => {
    console.log("refresh");
    getTicker()
      .then(object => console.log(object))
      .catch(err => console.log(err.message));
  }
  
};

async function getTicker() {
  let response = await fetch("http://localhost:8080/api/ticker");
  
  if(response.ok) {
    return await response.json();
  }
  throw Error(response.statusText);
}
