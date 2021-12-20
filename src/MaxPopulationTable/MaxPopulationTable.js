import {useEffect, useState} from "react";
import {getAllStarwarsVehicles, getVehiclePilots, getPilotsPlanets} from '../helpers';
import './MaxPopulationTable.css';

const MaxPopulationTable = () => {
    const [maxSumPopulation, setMaxSumPopulation] = useState({});
    const [apiMessage, setApiMessage] = useState("Loading...");

    useEffect(() => {
        (async () => {
            try {
                const starwarsVehicles = await getAllStarwarsVehicles();
                await getMaxPopulationDetails(starwarsVehicles);
            } catch (error) {
                setApiMessage("An error occurred while loading Star Wars data");
            }
        })();

    }, []);

    const getPopulationSum = (planets) => {
        return planets.reduce((accum, item) => {
            if (!isNaN(item.population)) {
                return accum + parseInt(item.population);
            }
        }, 0);
    }

    const getMaxPopulationDetails = async (starwarsVehicles) => {
        let tempMaxSum = {maxSum: 0};
        for (let i = 0; i < starwarsVehicles.length; i++) {
            let vehiclePlanetsPopulationSum = 0;
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
                vehiclePlanetsPopulationSum = getPopulationSum(planets);
                if (tempMaxSum.maxSum < vehiclePlanetsPopulationSum) {
                    tempMaxSum = {
                        vehicle: starwarsVehicles[i],
                        pilots: pilots,
                        planets: planets,
                        maxSum: vehiclePlanetsPopulationSum
                    }
                }
            }
        }
        setMaxSumPopulation(tempMaxSum);
    }

    return (
        <div className="App">
            {((maxSumPopulation?.vehicle?.name) && maxSumPopulation?.pilots?.length > 0 && maxSumPopulation?.planets?.length)
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
