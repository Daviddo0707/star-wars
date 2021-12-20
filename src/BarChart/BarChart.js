
import {useState, useEffect, Fragment} from "react";
import * as Styled from "./BarChart.styles";
import {getPlanetsDetails} from "../helpers";

const PLANETS = ['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor'];

const BarChart = () => {

    const [planets, setPlanets] = useState([]);
    const [apiMessage, setApiMessage] = useState("Loading...");

    useEffect(() => {
        (async () => {
            try {
                const planetsDetails = await getPlanetsDetails(PLANETS);
                setPlanets(planetsDetails);
            } catch (error) {
                setApiMessage("An error occurred while loading Star Wars data");
            }

        })()
    }, [])

    const greatestValue = values => values.reduce((acc, cur) => (cur > acc ? cur : acc), -Infinity);

    const greatestHeight = greatestValue(planets.map(planet => {
            return parseInt(planet.population);
        }
    ));

    return (
        <Fragment> {planets.length > 0 ?
            (
            <Styled.Container>
                {planets.map(({population, name}, i) => {
                    return (
                        <Styled.BarChartContainer key={i}>
                            <Styled.Text>{population} </Styled.Text>
                            <Styled.Bar height={(population/greatestHeight)*100} />
                            <Styled.Text>{name}</Styled.Text>
                        </Styled.BarChartContainer>
                    );
                })}
            </Styled.Container>
            )
            : <Styled.Message>{apiMessage}</Styled.Message>
        }
        </Fragment>
    );
}
export default BarChart;
