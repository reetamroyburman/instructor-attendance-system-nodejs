const {checkInOut} =require('../models/Schema')
const { error, success } = require("../utils/responseWrapper");



const checkIn = async (req, res) => {
    try {
        const { instructorId, checkInTime } = req.body;

        let instructor = await checkInOut.findOne({ instructorId });

        // if (instructor) {
        //     // return res.status(409).send("instructor is already registered");
        //     return res.send(error(409, "instructor is already registered"));
        // }


        const new_instructor = await checkInOut.create({
            instructorId,
            checkInOuts: [{ checkInTime }],
        });
        
        await instructor.save();
        res.status(201).json({
            message: 'Check-in recorded successfully',
            checkInData:new_instructor
        });
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const checkOut = async (req,res) => {
    try {
        const { instructorId, checkOutTime } = req.body;
        let instructor = await checkInOut.findOne({ instructorId });

        if (!instructor) {
            return res.status(404).json({ error: 'Instructor not found' });
        }
        
        const lastCheckIn = checkInOut.checkInOuts[instructor.checkInOuts.length - 1];

        if (lastCheckIn.checkOutTime) {
            return res.status(400).json({ error: 'Instructor has already checked out' });
        }

        lastCheckIn.checkOutTime = checkOutTime;

        await instructor.save();
        res.json({ 
            message: 'Check-out recorded successfully',
            data:instructor
        });
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const monthlyReport = async (req,res) => {
    try {
        const { month, year } = req.params;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const instructors = await Instructor.find({
            'checkIns.checkInTime': { $gte: startDate, $lte: endDate },
        });

        const monthlyReport = instructors.map(instructor => {
            const totalHours = instructor.checkIns.reduce((acc, curr) => {
              if (curr.checkOutTime) {
                const hours = (curr.checkOutTime - curr.checkInTime) / (1000 * 60 * 60);
                return acc + hours;
              }
              return acc;
            }, 0);
      
            return { instructorId: instructor.instructorId, totalHours };
          });

          res.json(monthlyReport);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}


module.exports = {
    checkIn,
    checkOut,
    monthlyReport
}