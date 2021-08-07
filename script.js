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

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      const coords = [latitude, longitude];

      const map = L.map("map").setView(coords, 7);
      console.log(map);
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on("click", function (mapEvent) {
        console.log(mapEvent);

        const { lat, lng } = mapEvent.latlng;
        L.marker(coords)
          .addTo(map)
          .bindPopup(
            l.popup({
              maxwidth: 300,
              minwidth: 200,
              autoclose: false,
              closeOnClick: false,
              className: "running-popup",
            })
          )
          .setPopupContent("workout")
          .openPopup();
      });
    },

    function () {
      alert(`You could not get accessed!`);
    }
  );
