import React, { useState } from 'react';
import './App.css';
const numeral = require('numeral');

function App() {
	const [title, setTitle] = useState('');
	const [query, setQuery] = useState('');
	const [confirmed, setConfirmed] = useState({});
	const [recovered, setRecovered] = useState({});
	const [deaths, setDeaths] = useState({});

	const getData = () => {
		fetch(`https://covid19.mathdro.id/api/countries/${query}`)
			.then((response) => {
				if (
					response.ok &&
					response.url !== 'https://covid19.mathdro.id/api/countries/' &&
					!query.includes('%') &&
					!query.includes('&') &&
					!query.includes('..')
				) {
					response.json().then((data) => {
						setConfirmed(data.confirmed);
						setRecovered(data.recovered);
						setDeaths(data.deaths);
						setTitle(query.toUpperCase());
						setQuery('');
					});
				} else {
					setQuery('');
					setTitle('Error, not found.');
					setConfirmed(0);
					setRecovered(0);
					setDeaths(0);
				}
			})
			.catch((error) => {
				setTitle('Error, not found.');
				setQuery('');
			});
	};

	const refreshGetData = () => {
		if (confirmed.value) {
			fetch(`https://covid19.mathdro.id/api/countries/${title}`)
				.then((response) => {
					if (response.ok) {
						response.json().then((data) => {
							setConfirmed(data.confirmed);
							setRecovered(data.recovered);
							setDeaths(data.deaths);
							setQuery('');
						});
					}
				})
				.catch((error) => {
					setTitle('Error, not found.');
					setQuery('');
				});
		} else {
			setQuery('');
		}
	};

	const search = (e) => {
		if (e.key === 'Enter') {
			setTitle('Loading...');
			getData();
		}
	};

	const refresh = () => {
		refreshGetData();
	};
	return (
		<div>
			<input
				className="search"
				type="text"
				placeholder="Search..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyPress={search}
			/>
			<div className="main">
				<p className="title">{title}</p>
				<button className="refresh" onClick={refresh}>
					Refresh
				</button>
				<div className="positive">
					<h2>Positive</h2>
					<h2 className="positive-number">{numeral(confirmed.value).format('0, 0')}</h2>
				</div>
				<div className="recovered">
					<h2>Recovered</h2>
					<h2 className="recovered-number">{numeral(recovered.value).format('0,0')}</h2>
				</div>
				<div className="deaths">
					<h2>Deaths</h2>
					<h2 className="deaths-number">{numeral(deaths.value).format('0,0')}</h2>
				</div>
			</div>
		</div>
	);
}

export default App;
