import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTerm, setFilterTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm, filterTerm);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ marginBottom: '10px' }}>Search And Filter Facilities</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '10px', width: '300px', display: 'flex', flexDirection: 'row' }}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search facilities..."
                    style={{ marginRight: '10px', padding: '5px', width: '70%' }}
                />
                <input
                    type="text"
                    value={filterTerm}
                    onChange={(e) => setFilterTerm(e.target.value)}
                    placeholder="Filter facilities..."
                    style={{ marginRight: '10px', padding: '5px', width: '30%' }}
                />
                <button type="submit" style={{ padding: '5px 10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', width: '100px' }}>Search</button>
            </form>
        </div>
    );
};

export default SearchBar;