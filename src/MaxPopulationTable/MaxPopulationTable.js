import {useEffect, useState} from "react";
import _ from 'lodash';
import {getAllStarwarsVehicles, getVehiclePilots, getPilotsPlanets} from '../helpers';
import './MaxPopulationTable.css';

const MaxPopulationTable = () => {
    const [maxSumPopulation, setMaxSumPopulation] = useState({});
    const [apiMessage, setApiMessage] = useState("Loading...");

    useEffect(() => {
        (async () => {
            try {
                const starwarsVehicles = await getAllStarwarsVehicles();
                getMaxPopulationDetails(starwarsVehicles);
            } catch (error) {
                setApiMessage("An error occurred while loading Star Wars data");
            }
        })();

    }, []);

    const getMaxPopulationDetails = async (starwarsVehicles) => {
        let maxSum = 0;
        let maxSumVehicle = {};
        let maxSumPlanets = [];
        let maxSumPilots = [];
        let vehiclePlanetsPopulationSum = 0;
        for (let i = 0; i < starwarsVehicles.length; i++) {
            vehiclePlanetsPopulationSum = 0;
            let planets = [];
            let pilots = [];
            if (starwarsVehicles[i]?.pilots?.length > 0) {
                try {
                    pilots = await getVehiclePilots(starwarsVehicles[i]);
                    planets = await getPilotsPlanets(pilots);
                } catch (error) {
                    setApiMessage("An error occurred while loading Star Wars data");
                    break;
                }
                vehiclePlanetsPopulationSum = planets.reduce((accum, item) => accum + !isNaN(item.population) ? parseInt(item.population) : 0, 0);
                if (maxSum < vehiclePlanetsPopulationSum) {
                    maxSum = vehiclePlanetsPopulationSum;
                    maxSumVehicle = starwarsVehicles[i];
                    maxSumPilots = pilots;
                    maxSumPlanets = planets;
                }
            }
        }
        setMaxSumPopulation({vehicle: maxSumVehicle, pilots: maxSumPilots, planets: maxSumPlanets});
    }

    return (
        <div className="App">
            {(!_.isEmpty(maxSumPopulation?.vehicle) && maxSumPopulation?.pilots.length > 0 && maxSumPopulation?.planets.length)
                ? (
                    <table>
                        <thead>
                        <tr>
                            <th>Vehicle name with the largest sum</th>
                            <td>{maxSumPopulation.vehicle.name}</td>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th>Related home planets and their respective population</th>
                            <td>{maxSumPopulation.planets.map((planet, index) =>
                                <div key={index}>{planet.name}, {planet.population}</div>)}</td>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th>Related pilot names</th>
                            <td>{maxSumPopulation.pilots.map((pilot, index) => <div
                                key={index}>{pilot.name}</div>)}</td>
                        </tr>
                        </thead>
                    </table>
                ) :
                (<span>{apiMessage}</span>)

            }
        </div>
    )
}
export default MaxPopulationTable;
