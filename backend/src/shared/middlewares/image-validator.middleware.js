const sizeOf = require('image-size');
const fs = require('fs');
const { errorResponse } = require('@/shared/utils/response.helper');

/**
 * Middleware to validate uploaded image dimensions (width, height)
 * @param {number} expectedWidth 
 * @param {number} expectedHeight 
 */
function validateImageDimensions(expectedWidth, expectedHeight) {
  return (req, res, next) => {
    if (!req.file) {
      return next(); // No file uploaded, proceed
    }

    try {
      const dimensions = sizeOf(req.file.path);
      
      if (dimensions.width !== expectedWidth || dimensions.height !== expectedHeight) {
        // Delete the invalid file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return errorResponse(
          res, 
          `Kapak resmi boyutları ${expectedWidth}x${expectedHeight} olmalıdır. (Yüklenen: ${dimensions.width}x${dimensions.height})`, 
          400
        );
      }
      
      // Dimensions are valid
      next();
    } catch (sizeErr) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return errorResponse(res, 'Resim boyutları okunamadı veya dosya bozuk.', 400);
    }
  };
}

module.exports = { validateImageDimensions };
