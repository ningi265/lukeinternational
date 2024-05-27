import React, { useState, useEffect } from 'react';
import FacilityForm from './components/FacilityForm';
import FacilityList from './components/FacilityList';
import SearchBar from './components/SearchBar';
import axios from 'axios';

const App = () => {
    const [facilities, setFacilities] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFacilities();
    }, []);

    const fetchFacilities = async () => {
        try {
            const response = await axios.get('/api/facilities');
            setFacilities(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleAddFacility = (facility) => {
        setFacilities([...facilities, facility]);
    };

    const handleArchiveFacility = async (id) => {
        try {
            await axios.delete(`/api/facilities/${id}`);
            setFacilities(facilities.filter(facility => facility.id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSearch = async (term) => {
        try {
            const response = await axios.get('/api/search', {
                params: { query: term },
            });
            setSearchResults(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', background: '#f0f0f0' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Hospital Facility Management</h1>
            <div style={{ marginBottom: '20px' }}>
                <FacilityForm onAdd={handleAddFacility} />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <SearchBar onSearch={handleSearch} />
            </div>
            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>
            ) : (
                <>
                    <FacilityList facilities={facilities} onArchive={handleArchiveFacility} />
                    {searchResults.length > 0 && (
                        <>
                            <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Search Results</h2>
                            <FacilityList facilities={searchResults} onArchive={() => {}} />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default App;
