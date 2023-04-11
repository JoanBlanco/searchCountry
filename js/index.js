const main = document.querySelector('.main');
const form = document.querySelector('#form');
const inputSearch = document.querySelector('#input-search');
let countries = [];
// EVENTO QUE SE EJECUTA AL CARGAR LA PAGINA
window.addEventListener('load', async () => {
    const loading = await loadApi();
    inputSearch.addEventListener('input',  e => filterCountry(e, loading));
});
/*******FUNCTIONS********/
//CARGAR API DE PAISES APENAS CARGUE LA PAGINA
const loadApi = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        countries = [...data];
        return countries;
    } catch (error) {
        console.log(error);
    }
}
// FILTRAR PAISES
const filterCountry = async (e, countries) => {
    // GUARDAR VALOR DEL TARGET
    const inputValue = e.target.value.toLowerCase();
    // METODO FILTER
    const countryFilter = countries.filter(element => element.name.common.toLowerCase().startsWith(inputValue));
    if (countryFilter.length === 1) {
        const [{latlng: [latitud, longitud]}] = countryFilter;
        const weatherInfo = await weatherApi(latitud, longitud);
        const {weather: [{description, icon}], main: {temp, temp_max, temp_min}} = weatherInfo;
        createCountry(countryFilter, description, temp, icon);
        return;
    }
    if (countryFilter.length > 1 && countryFilter.length <= 10) {
        createCountry(countryFilter);
        return;
    }
    if (countryFilter.length > 10) {
        alertMessage('Debes ser más especifico con su busqueda', 'alert');
        clearHTML();
        return;
    }
}
// CREAR CARD DE LOS PAISES
const createCountry = (countries, clima, temp, icon) => {
    clearHTML();
    countries.forEach(country => {
        const {flags: {png}, name: {common}, population, capital: [capital], region, languages: {spa}} = country;
        if (countries.length === 1) {
            main.innerHTML += 
            `
            <div class="card row">
                <div class="card-image">
                    <img src="${png}" alt="país">
                </div>
                <div class="card-info">
                    <h2>${common}</h2>
                    <p>Capital -> <span class="info">${capital}</span></p>
                    <p>Población -> <span class="info">${population}</span></p>
                    <p>Región -> <span class="info"> ${region}</span></p>
                    <p>Temperatura -> <span class="info">${temp} °C</span></p>
                    <p>Clima -> <span class="info">${clima}</span></p>
                    <img class="image-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon weather"/>
                </div>
            </div>
            `;
        } else {
            main.innerHTML += 
            `
            <div class="card">
                <div class="card-image">
                    <img src="${png}" alt="país">
                </div>
                <div class="card-info">
                    <h2>${common}</h2>
                </div>
            </div>
            `;
        }  
    });
}
const weatherApi = async (latitud, longitud) =>{
     const apiKey = '40fc6bf9742653061ae630aa66197940';
     const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitud}&lon=${longitud}&appid=${apiKey}`;
     try {
         const response = await fetch(url);
         const data = await response.json();
         return data;
     } catch (error) { console.log(error);}
}
// MENSAJEDE ALERTA
const alertMessage = (message, tipo) => {
    const div = document.createElement('div');
    div.textContent = message;
    div.classList.add(`${tipo}`);
    const messages = document.querySelectorAll(`.${tipo}`);
    if (messages.length === 0) {
        main.insertAdjacentElement('beforebegin' , div);
        setTimeout(() => div.remove(), 3000)
    }
} 
// LIMPIAR HTML
const clearHTML = () => {
    while (main.firstElementChild) main.removeChild(main.firstElementChild);
}