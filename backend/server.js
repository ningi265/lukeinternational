const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();

mongoose.connect("mongodb+srv://legend:1Brisothi20*@cluster0.ozy8jff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

app.use(express.json());

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
    const { facility_code, facility_name, district_id, owner_id } = req.body;

    // Check with master health facility registry
    try {
        const registryResponse = await axios.get('https://zipatala.health.gov.mw/api/facilities', {
            params: { facility_code, facility_name, district_id, owner_id },
        });

        const existingFacility = registryResponse.data.find(facility => 
            facility.facility_code === facility_code && 
            facility.facility_name.toLowerCase() === facility_name.toLowerCase() &&
            facility.district_id === district_id && 
            facility.owner_id === owner_id
        );

        if (existingFacility) {
            return res.json({ exists: true });
        }

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
    const facilities = await Facility.find({ archived: false });
    res.json(facilities);
});

// Archive a facility
app.delete('/api/facilities/:id', async (req, res) => {
    await Facility.findByIdAndUpdate(req.params.id, { archived: true });
    res.sendStatus(204);
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
