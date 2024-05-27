import React, { useState } from 'react';
import axios from 'axios';

const FacilityForm = ({ onAdd }) => {
    const [facility_name, setFacilityName] = useState('');
    const [district_id, setDistrictId] = useState('');
    const [owner_id, setOwnerId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/facilities', { facility_name, district_id, owner_id });
            if (response.data.exists) {
                setErrorMessage('Facility already exists in the registry.');
            } else {
                onAdd(response.data.facility);
                setFacilityName('');
                setDistrictId('');
                setOwnerId('');
                setSuccessMessage('You have successfully created a facility.');
                setErrorMessage('');
            }
        } catch (error) {
            console.error('Error adding facility', error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '20px' }}>Add New Facility</h2>
            {successMessage && <p style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>}
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', width: '300px' }}>
                <input
                    type="text"
                    value={facility_name}
                    onChange={(e) => setFacilityName(e.target.value)}
                    placeholder="Facility Name"
                    required
                    style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
                />
                <input
                    type="text"
                    value={district_id}
                    onChange={(e) => setDistrictId(e.target.value)}
                    placeholder="District ID"
                    required
                    style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
                />
                <input
                    type="text"
                    value={owner_id}
                    onChange={(e) => setOwnerId(e.target.value)}
                    placeholder="Owner ID"
                    required
                    style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
                />
                <button type="submit" style={{ padding: '5px 10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', width: '100%' }}>Add Facility</button>
            </form>
        </div>
    );
};

export default FacilityForm;
