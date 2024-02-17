const {checkInOut} =require('../models/Schema')

const checkIn = async (req, res) => {
    try {
        const { user_id } = req.user;

        let instructor = await checkInOut.findOne({ checkOutTime: null });

        if (instructor) {
            return  res.status(400).json({
                message: 'instructor already checked IN',
            });
        }

        const new_instructor = await checkInOut.create({
            instructorId: user_id,
        });
        
        await new_instructor.save();
        res.status(201).json({
            message: 'Check-in recorded successfully',
            checkInData:new_instructor
        });
    } catch (e) {
        return  res.status(500).json({
            message: e.message,
        });
    }
};

const checkOut = async (req,res) => {
    try {
        const { user_id } = req.user;
        let instructor = await checkInOut.findOne({ instructorId: user_id, checkOutTime: null });

        if (!instructor) {
            return res.status(404).json({ error: 'Record not found' });
        }
        
        instructor.checkOutTime = Date.now();

        await instructor.save();
        res.json({ 
            message: 'Check-out recorded successfully',
            data:instructor
        });
    } catch (e) {
        return  res.status(500).json({
            message: e.message,
        });
    }
}

const monthlyReport = async (req,res) => {
    try {
        const { month, year } = req.query;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const instructors = await checkInOut.find({
            'checkInTime': { $gte: startDate, $lte: endDate },
        });

        if(!instructors.length > 0){
            return res.status(400).json({ error: 'There is no record' });
        }

        let instructorReport = {}

        const monthlyReport = instructors.map(instructor => {
            const hours = ((instructor.checkOutTime - instructor.checkInTime) / (1000 * 60 * 60)).toFixed(2);
            
            if(instructorReport[instructor.instructorId] != null) {
                instructorReport[instructor.instructorId] += parseFloat(hours);
            } else {
                instructorReport[instructor.instructorId] = parseFloat(hours);
            }
        });

        res.json(instructorReport);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}


module.exports = {
    checkIn,
    checkOut,
    monthlyReport
}