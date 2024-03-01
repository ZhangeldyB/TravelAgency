document.addEventListener("DOMContentLoaded", function () {
    const countryDep = document.getElementById("departureCountry");
    const cityDep = document.getElementById("departureCity");
    const countryArr = document.getElementById("arrivalCountry");
    const cityArr = document.getElementById("arrivalCity");

    const hotelSelect = document.getElementById("hotel");
  
    fetch('/data/data.json')
        .then(response => response.json())
        .then(data => {
            data.map.forEach((country) => {
                const option = document.createElement("option");
                option.value = country.country;
                option.text = country.country;
                countryDep.add(option);
                const optionArrival = option.cloneNode(true);
                countryArr.add(optionArrival);
            });

            countryDep.addEventListener("change", function () {
                const selectedCountry = countryDep.value;
                const selectedCountryData = data.map.find(
                    (country) => country.country === selectedCountry
                );

                cityDep.innerHTML = "<option selected disabled>Select the city</option>";
                selectedCountryData.cities.forEach((city) => {
                    const option = document.createElement("option");
                    option.value = city.name;
                    option.text = city.name;
                    cityDep.add(option);
                });
            });

            countryArr.addEventListener("change", function () {
                const selectedCountry = countryArr.value;
                const selectedCountryData = data.map.find(
                    (country) => country.country === selectedCountry
                );

                cityArr.innerHTML = "<option selected disabled>Select the city</option>";
                selectedCountryData.cities.forEach((city) => {
                    const option = document.createElement("option");
                    option.value = city.name;
                    option.text = city.name;
                    cityArr.add(option);
                });
            });

            cityArr.addEventListener("change", function () {
                const selectedCity = cityArr.value;
                const selectedCityData = data.map.flatMap(country => country.cities).find(city => city.name === selectedCity);

                hotelSelect.innerHTML = "<option selected disabled>Select the hotel</option>";
                selectedCityData.hotels.forEach((hotel) => {
                    const option = document.createElement("option");
                    option.value = hotel;
                    option.text = hotel;
                    hotelSelect.add(option);
                });
            });
        })
        .catch(error => console.error('Error fetching data.json:', error));

        var form = document.querySelector('form');
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            
            var formData = {
                depCountry: document.getElementById('departureCountry').value,
                depCity: document.getElementById('departureCity').value,
                arrCountry: document.getElementById('arrivalCountry').value,
                arrCity: document.getElementById('arrivalCity').value,
                hotel: document.getElementById('hotel').value,
                dateDeparture: document.getElementById('dateDeparture').value,
                dateReturn: document.getElementById('dateReturn').value,
                adults: document.getElementById('adults').value,
                children: document.getElementById('children').value
            };
            
            fetch('/travelagency', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 400) {
                    alert('Error in booking the tour');
                    window.location.reload();
                } else {
                    document.getElementById("resultSection").innerHTML = `
                    <h2>Tour from ${data.result.depCity} to ${data.result.arrCity}</h2>
                    <p>price for tour is: ${data.result.tourCost}$</p>
                    `;
                } 
            }).catch(error => console.error('Error:', error));
        });
});


