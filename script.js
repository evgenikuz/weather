let main = document.querySelector('.main')
apiGeo = 'at_KghkjRa3LNdLxylRs86PX0n4ax0a6'
let api = '1d8b4ab823a40ae25b3463bc8d0962a3';

getForecast()
async function getForecast() {
    let lat, lon;
    navigator.geolocation.getCurrentPosition(success)
    function success(res) {
        lat = res.coords.latitude;
        lon = res.coords.longitude;
    }
    const geoposition = await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${api}`)
    let geoData = await geoposition.json()
    city(geoData.name)
}


main.addEventListener('click', function(e) {
    if (e.target.closest('.search__button')) {
        if(document.querySelector('.search__input').value.trim() !== '') {
            city(document.querySelector('.search__input').value.trim().toLowerCase());
        } else {
            document.querySelector('.search__input').classList.add('wrong')
            setTimeout(() => document.querySelector('.search__input').classList.remove('wrong'), 500)
        }
    }else if(e.target.closest('.search__input')) {
        document.querySelector('.search__input').onkeypress = function(e) {
            let key = e.which || e.keyCode
            if (key === 13) {
                document.querySelector('.search__button').click();
            }
        }
        
    } else if (e.target.closest('.forecast__change-city')) {
        showSearch();
    } else if (e.target.closest('.error__try-again')) {
        showSearch();
    }
})


async function city(cityName){
    const geo = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=en&appid=${api}`)
    const data = await geo.json()
    if(data.cod !== 200) {
        showError()
    } else {
        createForecast(data.main.temp, data.weather[0].main, data.name, data.weather[0].icon);
    }
};

function createForecast(temp, weather, nameOfCity, icon) {
    main.innerHTML = '';
    let forecast = document.createElement('div');
    forecast.className = "forecast";
    forecast.innerHTML = `
     <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
    <p class="forecast__temperature">${Math.round(temp)}℃</p>
    <p class="forecast__description">${weather} in ${nameOfCity}</p>
    <button class="forecast__change-city">Change city</button>
    `
    main.append(forecast)

}

function showSearch() {
    main.innerHTML = ''
    let search = document.createElement('div');
    search.className = 'search'
    search.innerHTML = `
    <input type="text" class="search__input" placeholder="Type your city here">
    <button type="submit" class="search__button">Find</button>
    `
    main.append(search)
}
function showError() {
    main.innerHTML = '';
    let error = document.createElement('div');
    error.className = "error";
    error.innerHTML = `
    <p class="error__text">Ooops. Something went wrong.</p>
    <p class="error__info">Error info</p>
    <button class="error__try-again">Try again</button>
    `
    main.append(error)
}