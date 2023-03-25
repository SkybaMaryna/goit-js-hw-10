import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
    dataInput: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info')
}

refs.dataInput.addEventListener('input', debounce(onGetData, DEBOUNCE_DELAY))

function onGetData(event) {
    const countryName = event.target.value.trim()
    if (countryName === "") {
        cleanData()
        return
    }

    fetchCountries(countryName)
        .then((countryObj) => {
            if (countryObj.length === 0) {
                cleanData()
            } else if (countryObj.length === 1){
           makeElementMarkup(countryObj)
        } else if (countryObj.length >= 2 && countryObj.length <= 10) {
           makeListMarkup(countryObj)
        } else if (countryObj.length > 10) {
                Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
                cleanData()
        }
    }, 
    ).catch((error) => 
        Notiflix.Notify.failure("Oops, there is no country with that name")
    )
}

function makeListMarkup(countryObj) {
    const countries = countryObj.reduce((acc, country) => acc + `<li><img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="45"></href=></img><p>${country.name.official}</p></li>`, "")
    refs.countryList.innerHTML = countries
    refs.countryInfo.innerHTML = ""
}

function makeElementMarkup(countryObj) {
    refs.countryInfo.innerHTML = `<div class="country-info__mainInfo"><img src="${countryObj[0].flags.svg}" alt="${countryObj[0].name.official}" width="60">
        <h1>${countryObj[0].name.official}</h1></div>
        <p> <span class="country-info__headers">Capital</span>: ${countryObj[0].capital} </p>
        <p> <span class="country-info__headers">Population</span>: ${countryObj[0].population} </p>
        <p> <span class="country-info__headers">Languages</span>: ${Object.values(countryObj[0].languages).join(", ")} </p>
        `
    refs.countryList.innerHTML = ""
}

function cleanData() {
    refs.countryInfo.innerHTML = ""
    refs.countryList.innerHTML = ""
}
