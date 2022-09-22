import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry() {
  const inputData = inputEl.value.trim();

  if (inputData === '') {
    clearInfoMarkup();
    clearListMarkup();
    return;
  }

  fetchCountries(inputData)
    .then(countries => {
      if (countries.length === 1) {
        renderCountryInfo(countries);
        clearListMarkup();
      } else if (countries.length > 1 && countries.length <= 10) {
        renderCountryList(countries);
        clearInfoMarkup();
      } else if (countries.length > 10) {
        clearListMarkup();
        clearInfoMarkup();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(Error => {
      clearListMarkup();
      clearInfoMarkup();
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `
      <li style="display: flex; gap: 10px; align-items: center; font-size: 15px;">
          <span style="font-size: 25px;">${country.flag}</span><p>${country.name.official}</p>
        </li>`;
    })
    .join('');

  countryList.innerHTML = markup;
  countryList.style.listStyle = 'none';
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(country => {
      return `
      <ul style="list-style: none;">
        <li style="display: flex; align-items: center; gap: 10px; font-size: 30px; font-weight: 700;"><span >${
          country.flag
        }</span><p style="margin: 0">${country.name.official}</p></li>
        <li><p><span style="font-weight: 700">Capital:</span> ${
          country.capital
        }</p></li>
        <li><p><span style="font-weight: 700">Population:</span> ${
          country.population
        }</p></li>
        <li><p><span style="font-weight: 700">Languages:</span> ${languagesMarkup(
          country.languages
        )}</p></li>
      </ul>`;
    })
    .join('');

  countryInfo.innerHTML = markup;
}

function languagesMarkup(languages) {
  const languageValue = Object.values(languages);
  return languageValue.join(', ');
}

function clearListMarkup() {
  countryList.innerHTML = '';
}
function clearInfoMarkup() {
  countryInfo.innerHTML = '';
}
