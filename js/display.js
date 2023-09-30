
function searchBySymbol() {


    let searchText = $("#search-value").val();
    let fixedSearchText = searchText.toLowerCase();
    
    const valid = myResponse.filter(x => x.symbol == fixedSearchText || x.id == fixedSearchText);
    console.log(valid);
    if(valid.length > 0) {
            showCoins();
            $(".card").hide();
            $(`.card-${valid[0].symbol}`).show();
            $("#search-value").val("");
            $("html,body").animate({
                scrollTop: $(`.card-${valid[0].symbol}`).offset().top
            });
    } else {
        if(searchText == "") {
            $(".card").show();
            $("html,body").animate({
                scrollTop: $(".card").offset().top
            });
            return true;
        } else {
            $("#staticBackdrop2").modal("show");
        }
        
    }
}
let indicator = false;

$(".graph-area-wrapper").hide();
$(".about-area-wrapper").hide();

function showCoins() {
    // indicator = false;
    $(".coins-area-wrapper").show();
    $(".card").show();
    $(".graph-area-wrapper").hide();
    $(".about-area-wrapper").hide();
}
function showGraph() {
    if(toggledCoins.length>0){
        $(".graph-area-wrapper").show();
        graph();
        $(".coins-area-wrapper").hide();
        $(".about-area-wrapper").hide();
    } else {
        $("#staticBackdrop3").modal("show");
    }
    // indicator = true;
    
}
// function showAbout() {
//     // indicator = false;
//     $(".about-area-wrapper").show();
//     $(".coins-area-wrapper").hide();
//     $(".graph-area-wrapper").hide();
// }



function graph () {

    let allDataPoints = [
        [],[],[],[],[]
    ]
    
    const chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true,
        title: {
            text: "COMPARING GRAPH"
        },
        axisX: {
            
            title: "chart updates every 2 secs"
        },
        axisY:{
            tickColor: "red",
            tickThickness: 5,
            prefix: "$"
        }, 
        toolTip: {
            shared: true
        },
        legend: {
            cursor:"pointer",
            verticalAlign: "top",
            fontSize: 22,
            fontColor: "dimGrey",
            itemclick : toggleDataSeries
        },
        data: [{ 
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "$####.00",
            xValueFormatString: "hh:mm:ss TT",
            showInLegend: true,
            name: "",
            dataPoints: allDataPoints[0]
            },
            {				
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "$####.00",
                showInLegend: true,
                name: "" ,
                dataPoints: allDataPoints[1]
        },
        {				
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "$####.00",
            showInLegend: true,
            name: "" ,
            dataPoints: allDataPoints[2]
        },
        {				
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "$####.00",
            showInLegend: true,
            name: "" ,
            dataPoints: allDataPoints[3]
        },
        {				
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "$####.00",
            showInLegend: true,
            name: "" ,
            dataPoints: allDataPoints[4]
    }]
    });
        
    function toggleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }
    
    function update () {
        
        
        $.ajax({
            url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${toggledCoins.join(",")},bfffd&tsyms=USD`,
            type: "GET",
            success: function (response) {
                toggledCoins.map((item, Index) => {
                    
                    item = item.toUpperCase(); 
                    let currentPrice = (response[item].USD);     

                    chart.options.data[Index].name = item + ":$" + currentPrice;

                    (allDataPoints[Index]).push({
                        x: new Date(), y: currentPrice,
                    })
                    
                chart.render();
                }
            )}
        })
    }	
    setInterval(function(){update()}, 2000);
}


