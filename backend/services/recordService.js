const Record = require("../models/Record");
const { AppError } = require("../utils/errorHandler");

const createRecord = async(data, userId) => {
    return await Record.create({...data, user: userId });
};

const getRecords = async(query, user) => {
    const filter = { isDeleted: false };

    if (query.type) filter.type = query.type;
    if (query.category) filter.category = query.category;

    if (query.startDate && query.endDate) {
        filter.date = {
            $gte: new Date(query.startDate),
            $lte: new Date(query.endDate),
        };
    }

    if (user.role !== "admin") filter.user = user._id;

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const records = await Record.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 });

    return records;
};

const updateRecord = async(id, data, user) => {
    const record = await Record.findById(id);
    if (!record || record.isDeleted)
        throw new AppError("Record not found", 404);

    if (user.role !== "admin" && record.user.toString() !== user._id.toString()) {
        throw new AppError("Not allowed", 403);
    }

    Object.assign(record, data);
    return await record.save();
};

const deleteRecord = async(id, user) => {
    const record = await Record.findById(id);
    if (!record || record.isDeleted)
        throw new AppError("Record not found", 404);

    if (user.role !== "admin" && record.user.toString() !== user._id.toString()) {
        throw new AppError("Not allowed", 403);
    }

    record.isDeleted = true;
    return await record.save();
};

module.exports = { createRecord, getRecords, updateRecord, deleteRecord };