"use strict";

const months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
const workouts = document.querySelector(".workouts");
const form = document.querySelector("form");
const type = document.querySelector(".form__input--type");
const distance = document.querySelector(".form__input--distance");
const duration = document.querySelector(".form__input--duration");
const cadence = document.querySelector(".form__input--cadence");
const elevation = document.querySelector(".form__input--elevation");

let map, mapEvent;
//to get geolocation
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      const coords = [latitude, longitude];
      //leaflet
      const map = L.map("map").setView(coords, 7);
      console.log(map);
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      //to click anywhere on map,
      map.on("click", function (mapE) {
        mapEvent = mapE;
        form.classList.remove("hidden");
        distance.focus();
      });
    },

    //if you don"t access;
    function () {
      alert(`You could not get accessed!`);
    }
  );

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const { lat, lng } = mapEvent.latlng;
  //display marker
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 300,
        minWidth: 200,
        autClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    //open and render workout popup;
    .setPopupContent("workout")
    .openPopup();
});
