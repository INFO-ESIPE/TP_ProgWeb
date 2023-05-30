"use strict";

const MAX_COLUMNS = 10;

window.onload = () => {
  let refreshButton = document.getElementById("refreshButton");
  let markText = document.getElementById("markText");
  let stockTable = document.getElementById("stockTable");
  let timeoutIDs = [];

  /* Mise à jour de la couleur */
  markText.onkeyup = () => {
    let minValue = parseInt(markText.value);

    for(let i = 0; i < stockTable.children.length; i++) {
      for(let j = 1; j < stockTable.children[i].children.length; j++) {

        let writtenValue = parseInt(stockTable.children[i].children[j].innerText);

        if(   Number.isInteger(minValue) 
           && Number.isInteger(writtenValue)
           && writtenValue <= minValue) {

          stockTable.children[i].children[j].classList.add("good-quotation");
        } else {
          stockTable.children[i].children[j].classList.remove("good-quotation");
        }
      }
    }
  }



  /* Clique sur le bouton "refresh" */
  refreshButton.onclick = () => {

    /* Mis à jour des noms des actions */
    fetch("http://localhost:8080/api/ticker")
      .then(response => {
        if(response.ok) {
          return response.json(); // ordre attendu : APL, GOOG, INTC, MSFT, HPQ, KO, WMT et HOG
        }
        throw Error(response.statusText);
      })
      .then(tickers => {
        
        createTable(tickers, MAX_COLUMNS)
        timeoutIDs.forEach(timeoutId => clearTimeout(timeoutId));
        timeoutIDs = [];

        for(let i = 0; i < MAX_COLUMNS; i++) {
          timeoutIDs.push(
            window.setTimeout(() => {
            fetch("http://localhost:8080/api/stock", { method : "post" })
              .then(response => {
                if(response.ok) {
                  return response.json();
                }
                throw Error(response.statusText);
              })
              .then(stocks => {
                fillColumn(stockTable, i, tickers, stocks);
                
              })
              .catch(err => console.log(err.message));
            }, 1000 + (i*1000))
          );

        }

      })
      .catch(err => console.log(err.message));
  };
};


function createTable(tickers, colomnsCount) {
  stockTable.innerHTML = "";

  tickers.forEach(ticker => {
    let tr = document.createElement("TR");
    let thTitle = document.createElement("TH");
    thTitle.innerText = ticker;
    tr.appendChild(thTitle);

    for(let i = 0; i < colomnsCount; i++) {
      let th = document.createElement("th");
      th.innerText = "-";
      tr.appendChild(th);
    }

    stockTable.append(tr);

  });

}

function fillColumn(table, columnNum, tickers, stocks) {
  let minValue = parseInt(markText.value);

  for(let i = 0; i < tickers.length; i++) {
    table.children[i].children[columnNum+1].innerText = stocks[tickers[i]];

    if(Number.isInteger(minValue)
    && stocks[tickers[i]] <= minValue) {
      table.children[i].children[columnNum+1].classList.add("good-quotation");
    }
  }
}
