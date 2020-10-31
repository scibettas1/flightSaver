
function displayCurrencies() {
    
    $.ajax({
        "async": true,
        "crossDomain": true,
        url: "https://currency-converter13.p.rapidapi.com/list",
        method: 'GET',
        "headers": {
            "x-rapidapi-host": "currency-converter13.p.rapidapi.com",
            "x-rapidapi-key": "48bf12c8d6msh0ac264695b8e047p12405fjsn64e8ea946e35",
            "Access-Control-Allow-Origin": "https://nickkdb.github.io/Group5-Repository"
        }
    }).then(function (response) {
        console.log(response);
        response = response.sort();

        for (var i = 0; i < response.length; i++) {
            var currencyOption = $('<option>').text(response[i]);
            if (response[i] === 'USD') {
                currencyOption.attr('selected', 'selected');
            }
            $('#fromCurrency').append(currencyOption);

        }

        for (var i = 0; i < response.length; i++) {
            var currencyOption = $('<option>').text(response[i]);
            if (response[i] === 'EUR') {
                currencyOption.attr('selected', 'selected');
            }
            $('#toCurrency').append(currencyOption);
        }

    })

$('#getCurrency').on('click', function () {
    var fromCurrency = $('#fromCurrency option:selected').text();
    var toCurrency = $('#toCurrency option:selected').text();
    var queryString = '&from=' + fromCurrency + '&to=' + toCurrency;
    console.log(queryString);

    $.ajax({
        "async": true,
        "crossDomain": true,
        url: "https://currency-converter13.p.rapidapi.com/convert?amount=1" + queryString,
        method: 'GET',
        "headers": {
            "x-rapidapi-host": "currency-converter13.p.rapidapi.com",
            "x-rapidapi-key": "48bf12c8d6msh0ac264695b8e047p12405fjsn64e8ea946e35"
        }
    }).then(function (response) {
        console.log(response);
        var exchange = $('<h4>');
        var rounded = parseFloat(response.amount);
        rounded = rounded.toFixed(2);
        exchange.text(rounded);

        var desc = $('<p>');
        desc.text('For every 1 ' + fromCurrency + ', you get ~ ' + rounded + ' ' + toCurrency + ' in return.');
        $('#displayCurrency').empty();
        $('#displayCurrency').append(exchange);
        $('#displayCurrency').append(desc);
    })
})
}

