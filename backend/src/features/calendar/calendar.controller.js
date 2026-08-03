const calendarService = require('./calendar.service');
const { successResponse, errorResponse } = require('@/shared/utils/response.helper');

class CalendarController {
  getHistory(req, res) {
    try {
      const data = calendarService.getHistory(req.user.id);
      return successResponse(res, data, 'Takvim geçmişi getirildi.');
    } catch (err) {
      console.log('Calendar getHistory Error:', err);
      return errorResponse(res, err.message, 400);
    }
  }
}

module.exports = new CalendarController();
