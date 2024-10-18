import { useEffect, useState } from 'react';
import Axios from 'axios';
import Dropdown from 'react-dropdown';
import { HiSwitchHorizontal } from 'react-icons/hi';
import 'react-dropdown/style.css';
import './App.css';

function App() {
    const [info, setInfo] = useState({});
    const [input, setInput] = useState(0);
    const [from, setFrom] = useState("BAM");
    const [to, setTo] = useState("HRK");
    const [options, setOptions] = useState([]);
    const [output, setOutput] = useState(0);
    const [isConverted, setIsConverted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
        const apiKey = "1cf0499f285c4aa06dfef970";
        const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
        Axios.get(apiUrl)
            .then(response => {
                setInfo(response.data.conversion_rates);
                setOptions(Object.keys(response.data.conversion_rates));
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Update currentIndex every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 3) % options.length); // Use options.length for cycling
        }, 3000); // 3000 ms = 3 seconds

        return () => clearInterval(interval); // Clear interval on component unmount
    }, [options.length]);

    // Function to convert the currency
    function convert() {
        const rateFrom = info[from];
        const rateTo = info[to];

        if (rateFrom && rateTo) {
            const convertedAmount = (input / rateFrom) * rateTo;
            setOutput(convertedAmount);
            setIsConverted(true);
        }
    }

    function flip() {
        const temp = from;
        setFrom(to);
        setTo(temp);
        setIsConverted(false);
    }

    return (
        <div className="App">
            {/* Currency Converter Section */}
            <div className="converter-section">
                <div className="heading">
                    <h1>Currency Converter</h1>
                </div>
                <div className="container">
                    <div className="input-container">
                        <span className="dollar-icon">$</span>
                        <input type="number" id="amount" value={input} onChange={e => setInput(e.target.value)} />
                        <label htmlFor="amount" className="input-label">Amount</label>
                    </div>
                    <div className="currency-input">
                        <Dropdown
                            options={options}
                            onChange={(e) => { setFrom(e.value); }}
                            value={from}
                            className="custom-dropdown"
                        />
                    </div>
                    <div className="switch">
                        <HiSwitchHorizontal size="30px" onClick={flip} />
                    </div>
                    <div className="currency-input2">
                        <Dropdown
                            options={options}
                            onChange={(e) => { setTo(e.value); }}
                            value={to}
                            className="custom-dropdown2"
                        />
                    </div>
                    <div className="button-container">
                        <button onClick={convert}>Convert</button>
                    </div>
                    {isConverted && (
                        <div className="output-container">
                            <p>{input} {from} = {output.toFixed(2)} {to}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="live-rates">
                <h2>Live Exchange Rates (Base: USD)</h2>
                <ul>
                    {options.length > 0 && Object.entries(info).slice(currentIndex, currentIndex + 3).map(([currency, rate]) => (
                        <li key={currency}>{currency}: {rate}</li>
                    ))}
                </ul>
            </div>
        </div>
        
    );
}

export default App;
