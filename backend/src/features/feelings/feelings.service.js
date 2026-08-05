const feelingsRepository = require('./feelings.repository');
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
    if (!VALID_TAGS.includes(tag)) {
      throw new Error(`Geçersiz etiket. Geçerli etiketler: ${VALID_TAGS.join(', ')}`);
    }

    const feelings = feelingsRepository.findByTag(tag, contentType);
    return feelings.map((f) => this._mapFeelingTags(f));
  }

  create(userId, contentId, text, tags = []) {
    const priv = usersService.getUserPrivileges(userId);
    if (priv && !priv.can_post_feelings) {
      throw new Error('"Bana Hissettirdikleri" paylaşma yetkiniz bulunmuyor.');
    }

    if ((!text || text.trim().length === 0) && (!tags || tags.length === 0)) {
      throw new Error('İçerik boş olamaz, en az bir etiket seçmelisiniz veya bir metin girmelisiniz.');
    }

    const invalidTags = tags.filter((t) => !VALID_TAGS.includes(t));
    if (invalidTags.length > 0) {
      throw new Error(`Geçersiz etiketler: ${invalidTags.join(', ')}`);
    }

    const result = feelingsRepository.insert(userId, contentId, text ? text.trim() : '');
    const feelingId = result.lastInsertRowid;

    feelingsRepository.insertTags(feelingId, tags);

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

    feelingsRepository.delete(feelingId);
    return true;
  }

  update(feelingId, userId, text, tags = []) {
    if ((!text || text.trim().length === 0) && (!tags || tags.length === 0)) {
      throw new Error('İçerik boş olamaz, en az bir etiket seçmelisiniz veya bir metin girmelisiniz.');
    }

    const invalidTags = tags.filter((t) => !VALID_TAGS.includes(t));
    if (invalidTags.length > 0) {
      throw new Error(`Geçersiz etiketler: ${invalidTags.join(', ')}`);
    }

    const feeling = feelingsRepository.findById(feelingId);
    if (!feeling) throw new Error('His bulunamadı.');

    if (feeling.user_id !== userId) {
      throw new Error('Sadece kendi hissinizi düzenleyebilirsiniz.');
    }

    feelingsRepository.update(feelingId, text ? text.trim() : '');

    feelingsRepository.deleteTags(feelingId);
    feelingsRepository.insertTags(feelingId, tags);

    const updatedFeeling = feelingsRepository.findByIdWithUser(feelingId);
    return this._mapFeelingTags(updatedFeeling);
  }

  toggleLike(feelingId, userId) {
    const feeling = feelingsRepository.findById(feelingId);
    if (!feeling) throw new Error('His bulunamadı.');

    const existingLike = feelingsRepository.findLike(feelingId, userId);

    if (existingLike) {
      feelingsRepository.deleteLike(feelingId, userId);
      return { liked: false };
    } else {
      feelingsRepository.insertLike(feelingId, userId);
      return { liked: true };
    }
  }

  getTopEmotionsForContents(contentIds) {
    return feelingsRepository.getTopEmotionsForContents(contentIds);
  }

  deleteByContentId(contentId) {
    return feelingsRepository.deleteByContentId(contentId);
  }

  getUserTopEmotions(userId, limit) {
    return feelingsRepository.getUserTopEmotions(userId, limit);
  }

  getUserWeeklyEmotion(userId) {
    return feelingsRepository.getUserWeeklyEmotion(userId);
  }
}

module.exports = new FeelingsService();
