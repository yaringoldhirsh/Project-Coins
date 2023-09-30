// [storing data from api RESPONSE about relevant coins]
let myResponse = [];

// {On DOM load call API}
$(() => {

    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/",
        type: "GET",
        success: function (response) {
        myResponse = response.slice(0, 100);
        console.log(myResponse);
        
        printCoins();
        },                                             
        error : err => console.error(err),
    })
})

// {Each iteration calls a function {createCoin} on specified coin}
function printCoins() {
    
    myResponse.map((coin) => {
        createCoin(coin);
    })
}

let coinInfoText;

// {Creating BootStrap Card with all coinData}
function createCoin(coinData) {
    
    // Index of specified coin
    let coinNumber = myResponse.indexOf(coinData);

    // Symbolic name of coin
    let coinSymbol = $("<h5></h5>").text(coinData.symbol).addClass("card-title");

    // Full-name of coin
    let coinName = $("<h6></h6>").text(coinData.name).addClass("card-subtitle");

    // Information text of coin
    coinInfoText = $("<div style='color: green'></div>").attr("id", (`coinInfoID${coinData.id}`));

    // Container of {coinInfoText ^} and for BootStrap Collapse id
    let coinInfo = $("<div></div>").append(coinInfoText).addClass("collapse coin-info").attr("id", (`coinID${coinNumber}`));

    // Toggle button for coin information and the BootStrap CollapseButton
    let coinButton = $("<button>More Details</button>")
        .addClass('btn btn-primary')
        .attr("type","button")
        .attr("data-bs-toggle","collapse")
        .attr("data-bs-target","#coinID" + coinNumber)
        .attr("aria-expanded","false")
        .attr("aria-controls",coinNumber)
        .addClass("information-button")

        // Adding onclick Event to more info button
        .on("click", function() {
            $(`#coinInfoID${coinData.id}`).html(`
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>`)
            collapseData(coinData.id);
        });

    // Toggle button for saving coins in Graph
    let toggleButton = $(`
        <div class="toggle-button">
            <label class="switch">
                <input type="checkbox" class="general-toggle-buttons" onclick="toggleCoin('${coinData.symbol}')" name="${coinData.symbol}" id="coinToggle-${coinData.symbol}">
                <span class="slider"></span>
            </label> 
        </div>`);

    // creating the BS Card body
    let cardBody = $("<div></div>").append(coinSymbol,coinName,coinInfo,coinButton,toggleButton).addClass("card-body");
    
    // creating the BS Card
    let coinCard = $("<div></div>").append(cardBody).addClass(`card card-${coinData.symbol}`);
    
    // appending the card to coins area
    let coinsArea = $(".coins-area").append(coinCard);
}

// { Displaying coinData in-BS Card }
function collapseData(id) {

    // `{id}` - the ID of the button called the function is passed.
    // checks if item (`coinInfoText${id}`) exists in localStorage.
    if (localStorage.getItem(`coinInfoText${id}`) === null) {

        getCoinApi(id);
    } else { 

        // Implementing currentTime of coin info for later calculations.
        let currentTime = Number(Date.now());

        // Getting information from an existing item.
        let coinInfo = JSON.parse(localStorage.getItem(`coinInfoText${id}`));
        
        // Refreshing coin info if (more details button) was clicked more than 2 minutes ago.
        if(currentTime - Number(coinInfo.time) >= 120000){
            
            getCoinApi(id);
        } else {

            let data = JSON.parse(localStorage.getItem(`coinInfoText${id}`));
            $("#coinInfoID" + id)
            .html(`<img src=${data.coinImage}>
            <div><br />
            USD: ${data.usd}&#36; <br />
            EUR: ${data.eur}&#128; <br />
            ILS: ${data.ils}&#8362
            </div>
            `)
        }
    }
}


function getCoinApi(id) {
    $.ajax({
        url :`https://api.coingecko.com/api/v3/coins/${id}`,
        type: "GET",
        success: function (data) {
            $("#coinInfoID" + id)
            .html(`<img src=${data.image.small}>
            <div><br />
            USD: ${data.market_data.current_price.usd}&#36; <br />
            EUR: ${data.market_data.current_price.eur}&#128; <br />
            ILS: ${data.market_data.current_price.ils}&#8362
            </div>
            `)

            const item = {
                id : id,
                coinImage : data.image.small,
                usd : data.market_data.current_price.usd,
                eur : data.market_data.current_price.eur,
                ils : data.market_data.current_price.ils,
                time: Date.now(),
            }
            localStorage.setItem(`coinInfoText${id}`,JSON.stringify(item));
        }, 
    })
}

let toggledCoins = [];
// (called From {toggleButton in F-createCoin} for marking cards)
function toggleCoin(symbol) {
    let toggledButton = $(`#coinToggle-${symbol}`);
    if (toggledCoins.length < 5){
        if (toggledButton[0].checked && !toggledCoins.includes(symbol)) {
            toggledCoins.push(symbol);
        } else {
            toggledCoins.splice(toggledCoins.indexOf(symbol),1);
            console.log(toggledButton);
            
        }
    } else {
        if (toggledCoins.includes(symbol)) {
            toggledCoins.splice(toggledCoins.indexOf(symbol),1);
        } else {
            toggledCoins.push(symbol);
            modalPopup(symbol)
            toggledButton[0].checked = false;
        } 
    }
}

$("#saveDataButton").on("click", function(){
    myResponse.map((item) => {
        if (insideToggled.includes(item.symbol)) {
            $(`#coinToggle-${item.symbol}`)[0].checked = true;
            if (toggledCoins.includes(item.symbol)) {
                return true;
            } else {
                toggledCoins.push(item.symbol);
            }
        } else {
            $(`#coinToggle-${item.symbol}`)[0].checked = false;
            toggledCoins = toggledCoins.filter(name => name !== item.symbol);
        }
    })
    $("#staticBackdrop").modal("hide");
})


let insideToggled = [];
function modalToggle(symbol){
    
    let toggledButton = $(`input[name=${symbol}]`);
    if (toggledButton[0].checked == false && insideToggled.includes(symbol)) {
        insideToggled.splice(insideToggled.indexOf(symbol),1);
    } else {
        if (toggledButton[0].checked) {
            if(insideToggled.length < 5) {
                insideToggled.push(symbol);
            } else {
                toggledButton[0].checked = false;
            }
        }
    }
}


function modalPopup(symbol) {
    
    $(".modal-body").empty();
    insideToggled = [];
    let sixthButton = $(`
        <div>${symbol}
            <div class="modal-toggle-button">
                <label class="switch">
                <input type="checkbox" onclick="modalToggle('${symbol}')" name="${symbol}" >
                <span class="slider"></span>
                </label> 
            </div>
        </div>`);
    toggledCoins.pop();
    toggledCoins.map((item) => {
        insideToggled.push(item);
        let toggleButton = $(`
            <div class="modal-toggle-container">${item}
                <div class="modal-toggle-button">
                    <label class="switch">
                    <input type="checkbox" onclick="modalToggle('${item}')" name="${item}"  checked>
                    <span class="slider"></span>
                    </label> 
                </div>
            </div>`)
            $(".modal-body").append(toggleButton);
    })
    $(".modal-body").append(sixthButton);
    $("#staticBackdrop").modal("show");
}


