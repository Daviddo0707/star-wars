import './App.css';
import MaxPopulationTable from "./MaxPopulationTable/MaxPopulationTable";
import BarChart from "./BarChart/BarChart";


function App() {
    return (
        <div className="App">
            <h1>Tikal Star Wars Challenge</h1>
            <h3>Part 1</h3>
            <MaxPopulationTable/>
            <h3>Part 2</h3>
            <BarChart/>
        </div>
    );
}

export default App;

