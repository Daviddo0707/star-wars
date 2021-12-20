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
            let promises = [];
            for (let i = 2; i <= numberOfPagesLeft; i++) {
                promises.push(axios(`${BASE_URL}vehicles?page=${i}`));
            }

            return Promise.all(promises);
        })
        .then(response => {
            vehicles = response.reduce((acc, data) => [...acc, ...data.data.results], vehicles);

            return vehicles;
        })
}

export const getVehiclePilots = (vehicle = {}) => {
    let pilots = [];
    let promises = [];

    for (let i = 0; i < vehicle.pilots.length; i++) {
        promises.push(axios(vehicle.pilots[i]));
    }
    return Promise.all(promises).then((response) => {
        pilots = response.map((pilot) => pilot.data)

        return pilots;
    })
}

export const getPilotsPlanets = (pilots = []) => {
    let planets = [];
    let promises = [];
    let usedPlanets = [];
    for (let i = 0; i < pilots.length; i++) {
        if (!usedPlanets.includes(pilots[i].homeworld)) {
            promises.push(axios(pilots[i].homeworld));
            usedPlanets.push(pilots[i].homeworld)
        }

    }
    return Promise.all(promises).then((response) => {
        planets = response.map((planet) => planet.data)

        return planets;
    })
}

export const getPlanetsDetails = (planetsName = []) => {
    let planets = [];
    let promises = [];
    for (let i = 0; i < planetsName.length; i++) {
        promises.push(axios(`${BASE_URL}planets/?search=${planetsName[i]}`));
    }

    return Promise.all(promises).then((response) => {
        planets = response.map((planet) => planet.data.results[0])

        return planets;
    })
}
