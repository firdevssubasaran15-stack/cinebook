const sharedListsRepository = require('./shared-lists.repository');

class SharedListsPolicy {
  canView(list, userId) {
    if (list.owner_id === userId) return true;
    if (list.is_public === 1) return true;
    
    const member = sharedListsRepository.findMember(list.id, userId);
    if (!member) {
      throw new Error('Bu listeyi görüntüleme yetkiniz yok.');
    }
    return true;
  }

  canAddContent(list, userId) {
    if (list.owner_id === userId) return true;
    
    const member = sharedListsRepository.findMember(list.id, userId);
    if (!member) {
      throw new Error('Bu listeye içerik ekleme yetkiniz yok.');
    }
    return true;
  }

  canInvite(list, ownerId, targetUserId) {
    if (list.owner_id !== ownerId) {
      throw new Error('Sadece liste sahibi davet gönderebilir.');
    }
    if (ownerId === targetUserId) {
      throw new Error('Kendinizi davet edemezsiniz.');
    }
    return true;
  }

  canToggleVisibility(list, userId) {
    if (list.owner_id !== userId) {
      throw new Error('Sadece liste sahibi bu ayarı değiştirebilir.');
    }
    return true;
  }

  canSave(list, userId) {
    if (list.is_public !== 1) {
      throw new Error('Bu liste gizli, kaydedilemez.');
    }
    if (list.owner_id === userId) {
      throw new Error('Kendi listenizi kaydedemezsiniz.');
    }
    return true;
  }
}

module.exports = new SharedListsPolicy();
