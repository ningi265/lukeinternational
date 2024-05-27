const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();

mongoose.connect("mongodb+srv://legend:1Brisothi20*@cluster0.ozy8jff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

app.use(express.json());


// Function to fetch district codes from the master registry
// Assuming you have the axios and express modules properly imported

// Function to fetch district codes from the master registry
const fetchDistrictCodes = async () => {
    try {
        const response = await axios.get('https://zipatala.health.gov.mw/api/districts');
        return response.data;
    } catch (error) {
        console.error('Error fetching district codes', error);
        throw new Error('Error fetching district codes');
    }
};

// Function to generate a unique facility code
const generateFacilityCode = async () => {
    const districts = await fetchDistrictCodes();
    const randomDistrict = districts[Math.floor(Math.random() * districts.length)].code;
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
    const facilityCode = `${randomDistrict}${randomNumber}`;
    return facilityCode;
};


// Facility schema and model
const facilitySchema = new mongoose.Schema({
    facility_code: String,
    facility_name: String,
    district_id: String,
    owner_id: String,
    archived: { type: Boolean, default: false },
});

const Facility = mongoose.model('Facility', facilitySchema);

// Create a new facility
app.post('/api/facilities', async (req, res) => {
    const { facility_name, district_id, owner_id } = req.body;

    try {
        // Generate a unique facility code
        const facility_code = await generateFacilityCode();

        // Fetch facilities from the master health registry
        const registryResponse = await axios.get('https://zipatala.health.gov.mw/api/facilities', {
            params: { name: facility_name },
        });

        // Check if the facility already exists
        const existingFacility = registryResponse.data.find(facility => 
            facility.facility_code === facility_code && 
            facility.facility_name.toLowerCase() === facility_name.toLowerCase() &&
            facility.district_id === district_id && 
            facility.owner_id === owner_id
        );

        if (existingFacility) {
            return res.json({ exists: true });
        }

        // If facility doesn't exist, save it to the local database
        const facility = new Facility({ facility_code, facility_name, district_id, owner_id });
        await facility.save();
        res.json({ exists: false, facility });
    } catch (error) {
        console.error('Error checking facility registry', error);
        res.status(500).json({ message: 'Error checking facility registry' });
    }
});



// Get all facilities
app.get('/api/facilities', async (req, res) => {
    const { name, district_id, owner_id, archived } = req.query;
    const filter = {};

    if (name) {
        filter.facility_name = { $regex: new RegExp(name, 'i') };
    }

    if (district_id) {
        filter.district_id = district_id;
    }

    if (owner_id) {
        filter.owner_id = owner_id;
    }

    if (archived) {
        filter.archived = archived === 'true';
    }

    try {
        const facilities = await Facility.find(filter);
        res.json(facilities);
    } catch (error) {
        console.error('Error fetching facilities', error);
        res.status(500).json({ message: 'Error fetching facilities' });
    }
});


// Search facilities from master registry
app.get('/api/search', async (req, res) => {
    const { query } = req.query;
    try {
        const response = await axios.get('https://zipatala.health.gov.mw/api/facilities', {
            params: { name: query },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error searching facilities in registry', error);
        res.status(500).json({ message: 'Error searching facilities in registry' });
    }
});

// Archive a facility
app.delete('/api/facilities/:id', async (req, res) => {
    try {
        await Facility.findByIdAndUpdate(req.params.id, { archived: true });
        res.sendStatus(204);
    } catch (error) {
        console.error('Error archiving facility', error);
        res.status(500).json({ message: 'Error archiving facility' });
    }
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
