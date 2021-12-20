import axios from "axios";
const BASE_URL = "https://swapi.py4e.com/api/";

export const getAllStarwarsVehicles = () => {
    let vehicles = [];
    return axios(BASE_URL + "vehicles")
        .then(response => {
            vehicles = response.data.results;

            return response.data.count;
        })
        .then(count => {
            const numberOfPagesLeft = Math.ceil((count - 1) / 10);
            const promises = [];
            for (let i = 2; i <= numberOfPagesLeft; i++) {
                promises.push(axios(`${BASE_URL}vehicles?page=${i}`));
            }

            return Promise.all(promises);
        })
        .then(response => response.reduce((acc, data) => [...acc, ...data.data.results], vehicles))
}

export const getVehiclePilots = (vehicle = {}) => {
    const promises = [];
    for (let i = 0; i < vehicle.pilots.length; i++) {
        promises.push(axios(vehicle.pilots[i]));
    }
    return Promise.all(promises).then((response) => response.map((pilot) => pilot.data))
}

export const getPilotsPlanets = (pilots = []) => {
    const promises = [];
    const usedPlanets = [];
    for (let i = 0; i < pilots.length; i++) {
        if (!usedPlanets.includes(pilots[i].homeworld)) {
            promises.push(axios(pilots[i].homeworld));
            usedPlanets.push(pilots[i].homeworld)
        }

    }
    return Promise.all(promises).then((response) => response.map((planet) => planet.data))
}

export const getPlanetsDetails = (planetsName = []) => {
    const promises = [];
    for (let i = 0; i < planetsName.length; i++) {
        promises.push(axios(`${BASE_URL}planets/?search=${planetsName[i]}`));
    }

    return Promise.all(promises).then((response) => response.map((planet) => planet.data.results[0]))
}
