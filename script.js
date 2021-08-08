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

class Workout {
  date = new Date();
  id = (new Date() + "").slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration= duration;
  }
}
class Rrunning extends Workout {
     constructor (coords, distance, duration, cadence){
     super (coords, distance, duration,)
     this.cadence = cadence;
}
}
class Cycling extends Workout {
     constructor ()
}

class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();

    form.addEventListener("submit", this._newWorkout.bind(this));

    type.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    //to get geolocation
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        //if you don"t access;
        function () {
          alert(`You could not get accessed!`);
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];
    //leaflet
    this.#map = L.map("map").setView(coords, 7);
    console.log(map);
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    //to click anywhere on map,
    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    distance.focus();
  }

  _toggleElevationField() {
    elevation.closest(".form__row").classList.toggle("form__row--hidden");
    cadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    e.preventDefault();
    const { lat, lng } = this.#mapEvent.latlng;

    distance.value = duration.value = cadence.value = elevation.value = "";
    //display marker
    L.marker([lat, lng])
      .addTo(this.#map)
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
  }
}
const app = new App();
