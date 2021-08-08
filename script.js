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

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}
class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
  }
}
class Cycling extends Workout {
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
  }
}
const run1 = new Running([25, -77], 25, 30, 75);
const run2 = new Cycling([30, -45], 50, 35, 70);
console.log(run1, run2);

//application architecture

const workouts = document.querySelector(".workouts");
const form = document.querySelector("form");
const type = document.querySelector(".form__input--type");
const distance = document.querySelector(".form__input--distance");
const duration = document.querySelector(".form__input--duration");
const cadence = document.querySelector(".form__input--cadence");
const elevation = document.querySelector(".form__input--elevation");

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
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));

    e.preventDefault();
    //get data from form
    const Type = type.value;
    const Distance = distance.value;
    const Duration = duration.value;
    //if input is valid

    //if activity running;create running object
    if (Type === "running") {
      const Cadence = +cadence.value;
      if (
        // ! Number.isFinite(distance)
        // !Number.isFinite(duration)
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, Cadence)
      )
        return alert("Inputs have to be  positive numbers");
    }
    //if activity is cycling;create cycling object
    if (Type === "cycling") {
      const Elevation = +elevation.value;
      if (!validInputs(distance, duration, Elevation))
        return alert("Inputs have to be positive numbers");
    }
    //add new object to workout array

    //render workout on map marker

    const { lat, lng } = this.#mapEvent.latlng;
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
    //render workout on list

    //hide + clear input field
    distance.value = duration.value = cadence.value = elevation.value = "";
    //display marker
  }
}
const app = new App();
