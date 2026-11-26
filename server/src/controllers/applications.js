const applicationService = require('../services/applicationService');
const { sendSuccess }    = require('../utils/response');

async function list(req, res, next) {
  try {
    const result = await applicationService.list(req.user.id, req.query);
    return sendSuccess(res, result);
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const application = await applicationService.create(req.user.id, req.body);
    return sendSuccess(res, { application }, 'Application created', 201);
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const result = await applicationService.getById(
      Number(req.params.id),
      req.user.id
    );
    return sendSuccess(res, result);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const application = await applicationService.update(
      Number(req.params.id),
      req.user.id,
      req.body
    );
    return sendSuccess(res, { application }, 'Application updated');
  } catch (err) {
    return next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const application = await applicationService.updateStatus(
      Number(req.params.id),
      req.user.id,
      req.body.status
    );
    return sendSuccess(res, { application }, 'Status updated');
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    await applicationService.remove(Number(req.params.id), req.user.id);
    return sendSuccess(res, null, 'Application deleted');
  } catch (err) {
    return next(err);
  }
}

module.exports = { list, create, getById, update, updateStatus, remove };
