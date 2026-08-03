function successResponse(res, data, message = 'İşlem başarılı.', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function errorResponse(res, message = 'Bir hata oluştu.', statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = { successResponse, errorResponse };
