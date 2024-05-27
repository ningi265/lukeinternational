import React from 'react';

const FacilityList = ({ facilities, onArchive }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '20px' }}>Search Results For Facilities </h2>
            <ul style={{ listStyleType: 'none', padding: 0, width: '300px' }}>
                {facilities.map(facility => (
                    <li key={facility.facility_code} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}>
                        {facility.facility_name} - {facility.district_id}
                        <button style={{ marginLeft: '10px', padding: '5px 10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }} onClick={() => onArchive(facility.facility_code)}>Archive</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FacilityList;
