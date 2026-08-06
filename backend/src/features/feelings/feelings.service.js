const feelingsRepository = require('./feelings.repository');
const feelingLikesRepository = require('./feelingLikes.repository');
const feelingTagsRepository = require('./feelingTags.repository');
const FeelingsValidator = require('./feelings.validator');
const { VALID_TAGS } = require('./feelings.constants');
const usersService = require('@/features/users/users.service');

class FeelingsService {
  _mapFeelingTags(feeling) {
    const tags = feeling.tags_string ? feeling.tags_string.split(',') : [];
    // tags_string property'sini temizleyip temiz tags dizisini dönüyoruz
    delete feeling.tags_string;
    return { ...feeling, tags };
  }

  getByContentId(contentId, currentUserId = null) {
    const feelings = feelingsRepository.findByContentId(contentId, currentUserId || -1);
    return feelings.map((f) => this._mapFeelingTags(f));
  }

  searchByTag(tag, contentType = null) {
    FeelingsValidator.validateTagSearch(tag);

    const feelings = feelingsRepository.findByTag(tag, contentType);
    return feelings.map((f) => this._mapFeelingTags(f));
  }

  create(userId, contentId, text, tags = []) {
    const priv = usersService.getUserPrivileges(userId);
    if (priv && !priv.can_post_feelings) {
      throw new Error('"Bana Hissettirdikleri" paylaşma yetkiniz bulunmuyor.');
    }

    FeelingsValidator.validateFeelingInput(text, tags);

    const result = feelingsRepository.insert(userId, contentId, text ? text.trim() : '');
    const feelingId = result.lastInsertRowid;

    feelingTagsRepository.insertTags(feelingId, tags);

    const feeling = feelingsRepository.findByIdWithUser(feelingId);
    return this._mapFeelingTags(feeling);
  }

  delete(feelingId, userId, isAdmin) {
    const feeling = feelingsRepository.findById(feelingId);
    if (!feeling) throw new Error('His bulunamadı.');
    
    let isModerator = isAdmin;
    if (!isAdmin) {
      const priv = usersService.getUserPrivileges(userId);
      isModerator = priv && priv.can_moderate_content === 1;
    }

    if (!isModerator && feeling.user_id !== userId) {
      throw new Error('Bu hissi silme yetkiniz yok.');
    }

    feelingTagsRepository.deleteTags(feelingId);
    feelingsRepository.delete(feelingId);
    return true;
  }

  update(feelingId, userId, text, tags = []) {
    FeelingsValidator.validateFeelingInput(text, tags);

    const feeling = feelingsRepository.findById(feelingId);
    if (!feeling) throw new Error('His bulunamadı.');

    if (feeling.user_id !== userId) {
      throw new Error('Sadece kendi hissinizi düzenleyebilirsiniz.');
    }

    feelingsRepository.update(feelingId, text ? text.trim() : '');

    feelingTagsRepository.deleteTags(feelingId);
    feelingTagsRepository.insertTags(feelingId, tags);

    const updatedFeeling = feelingsRepository.findByIdWithUser(feelingId);
    return this._mapFeelingTags(updatedFeeling);
  }

  toggleLike(feelingId, userId) {
    const feeling = feelingsRepository.findById(feelingId);
    if (!feeling) throw new Error('His bulunamadı.');

    const existingLike = feelingLikesRepository.findLike(feelingId, userId);

    if (existingLike) {
      feelingLikesRepository.deleteLike(feelingId, userId);
      return { liked: false };
    } else {
      feelingLikesRepository.insertLike(feelingId, userId);
      return { liked: true };
    }
  }

  getTopEmotionsForContents(contentIds) {
    return feelingTagsRepository.getTopEmotionsForContents(contentIds);
  }

  deleteByContentId(contentId) {
    feelingTagsRepository.deleteTagsByContentId(contentId);
    return feelingsRepository.deleteByContentId(contentId);
  }

  getUserTopEmotions(userId, limit) {
    return feelingTagsRepository.getUserTopEmotions(userId, limit);
  }

  getUserWeeklyEmotion(userId) {
    return feelingTagsRepository.getUserWeeklyEmotion(userId);
  }
}

module.exports = new FeelingsService();
