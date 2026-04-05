const recordService = require("../services/recordService");

// Create
const create = async(req, res, next) => {
    try {
        const record = await recordService.createRecord(req.body, req.user._id);

        res.status(201).json({
            success: true,
            data: record,
        });
    } catch (err) {
        next(err);
    }
};

// Get
const getAll = async(req, res, next) => {
    try {
        const records = await recordService.getRecords(req.query, req.user);

        res.status(200).json({
            success: true,
            data: records,
        });
    } catch (err) {
        next(err);
    }
};

// Update
const update = async(req, res, next) => {
    try {
        const record = await recordService.updateRecord(
            req.params.id,
            req.body,
            req.user
        );

        res.status(200).json({
            success: true,
            data: record,
        });
    } catch (err) {
        next(err);
    }
};

// Delete
const remove = async(req, res, next) => {
    try {
        const record = await recordService.deleteRecord(
            req.params.id,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Record deleted",
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    create,
    getAll,
    update,
    remove,
};