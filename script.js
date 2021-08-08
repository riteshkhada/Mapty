"use strict";

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
  _setDescription() {
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
    this.description = `${this.type[0].toUpperCase}${this.type.slice(1)}on ${
      months[this.date.getMonth]
    }${this.date.getDate}`;
  }
}
class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
  }
}
class Cycling extends Workout {
  type = "cycling";

  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.type = "cycling";
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
  }
}

//application architecture

const workouts = document.querySelector(".workouts");
const form = document.querySelector("form");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();

    form.addEventListener("submit", this._newWorkout.bind(this));

    inputType.addEventListener("change", this._toggleElevationField);
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
    const {latitude} = position.coords;
    const {longitude} = position.coords;

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
    inputDistance.focus();
  }
  _hideForm() {
    //empty hidden
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";
    // form.style.display = "none";
    /// form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }
  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const {lat, lng} = this.#mapEvent.latlng;
    let workout;

    // If workout running, create running object
    if (type === "running") {
      const cadence = +inputCadence.value;

      // Check if data is valid
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert("Inputs have to be positive numbers!");

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout cycling, create cycling object
    if (type === "cycling") {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert("Inputs have to be positive numbers!");

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    //add new object to workout array
    this.#workouts.push(workout);
    console.log(workout);
    //render workout on map marker
    this._renderWorkoutMarker(workout);

    //render workout on list
    this._renderWorkout(workout);
    //hide + clear input field
    this._hideForm();
    //display marker
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 300,
          minWidth: 200,
          autClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      //open and render workout popup;
      .setPopupContent("Workouts")
      .openPopup();
  }
  _renderWorkout(workout) {
    let html = `
       <li class="workout workout--${workout.type}" data-id="${workout.id}">
       <h2 class="workout__title">${workout.description}</h2>
       <div class="workout__details">
         <span class="workout__icon">${
           workout.type === Running ? "🏃‍♂️" : "🚴‍♀️"
         }</span>
         <span class="workout__value">${workout.distance}</span>
         <span class="workout__unit">km</span>
       </div>
       <div class="workout__details">
         <span class="workout__icon">⏱</span>
         <span class="workout__value">${workout.duration}</span>
         <span class="workout__unit">min</span>
       </div>`;
    if (workout.type === "running") {
      html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
          </li>
            `;

      if (workout.type === "cycling") {
        html += `
               <div class="workout__details">
                 <span class="workout__icon">⚡️</span>
                 <span class="workout__value">${workout.speed.toFixed(1)}</span>
                 <span class="workout__unit">km/h</span>
               </div>
               <div class="workout__details">
                 <span class="workout__icon">⛰</span>
                 <span class="workout__value">${workout.elevation}</span>
                 <span class="workout__unit">m</span>
               </div>
             </li>
                 `;
        form.insertAdjacentElement("afterend", html);
      }
    }
  }
}
const app = new App();
