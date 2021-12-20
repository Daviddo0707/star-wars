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

export const getVehiclePilots = async (vehicle = {}) => {
    const promises = vehicle?.pilots?.map(pilot => axios(pilot));
    try {
        const response = await Promise.all(promises);
        return response.map(({data}) => data);
    } catch (e) {
        throw new Error(e.message);
    }
}

export const getPilotsPlanets = async (pilots = []) => {
    const planets = []
    const promises = pilots.map((pilot) => {
        if (!planets.includes(pilot.homeworld)) {
            planets.push(pilot.homeworld);
            return axios(pilot.homeworld);
        }
    });
    try {
        const response = await Promise.all(promises);
        return response.map(({data}) => data);
    } catch (e) {
        throw new Error(e.message);
    }
}

export const getPlanetsDetails = async (planetsName = []) => {
    const promises = planetsName.map(planetName => axios(`${BASE_URL}planets/?search=${planetName}`));
    try {
        const response = await Promise.all(promises);
        return response.map(({data}) => data.results[0]);
    } catch (e) {
        throw new Error(e.message);
    }
}
