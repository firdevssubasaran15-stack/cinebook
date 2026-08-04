import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { contentApi } from '@/api/endpoints/content.api';
import { commentsApi } from '@/api/endpoints/comments.api';
import { feelingsApi } from '@/api/endpoints/feelings.api';
import { libraryApi } from '@/api/endpoints/library.api';
import CommentsSection from '@/features/comments/components/CommentsSection';
import CommentItem from '@/features/comments/components/CommentItem';
import LibraryStatusSelector from '@/features/library/components/LibraryStatusSelector';
import EmotionTagSelector from '@/features/feelings/components/EmotionTagSelector';
import { useAuth } from '@/context/AuthContext';
import { GRADIENTS } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { API_BASE_URL } from '@/constants/api';
import { EMOTION_TAGS } from '@/constants/emotions';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/features/icon/components/Icon';

// Duygu etiketi ile arama yapılabilen section
function FeelingsSection({ contentId }) {
  const [feelings, setFeelings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tagFilter, setTagFilter] = useState(null);
  const { user, isAdmin, privileges } = useAuth();
  const { colors: COLORS } = useTheme();
  const isModerator = isAdmin || privileges?.can_moderate_content === 1;

  // Yeni hissettirdikleri
  const [newText, setNewText] = useState('');
  const [newTags, setNewTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchFeelings = useCallback(async () => {
    try {
      let res;
      if (tagFilter) {
        res = await feelingsApi.searchByTag(tagFilter);
        // Sadece bu içeriğe ait olanları filtrele
        const filtered = res.data.data.filter((f) => f.content_id === parseInt(contentId));
        setFeelings(filtered);
      } else {
        res = await feelingsApi.getByContentId(contentId);
        setFeelings(res.data.data);
      }
    } catch (err) {
      console.log('Feelings error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [contentId, tagFilter]);

  useEffect(() => { fetchFeelings(); }, [fetchFeelings]);

  const handleToggleTag = (tagId) => {
    setNewTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async () => {
    if (!newText.trim() && newTags.length === 0) {
      Alert.alert('Uyarı', 'Lütfen bir metin girin veya en az bir etiket seçin.');
      return;
    }
    setSubmitting(true);
    try {
      await feelingsApi.create(contentId, newText.trim(), newTags);
      setNewText('');
      setNewTags([]);
      setShowForm(false);
      fetchFeelings();
      Alert.alert('Başarılı', '"Bana Hissettirdikleri" paylaşıldı! 💫');
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Paylaşım yapılamadı.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFeeling = (feelingId) => {
    Alert.alert('Sil', 'Bu hissi silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await feelingsApi.delete(feelingId);
            fetchFeelings();
            Alert.alert('Başarılı', 'His silindi.');
          } catch (err) {
            Alert.alert('Hata', err.response?.data?.message || 'Silinemedi.');
          }
        },
      },
    ]);
  };

  const handleEditFeeling = async (feelingId, text, tags) => {
    try {
      await feelingsApi.update(feelingId, text, tags);
      fetchFeelings();
      Alert.alert('Başarılı', 'His güncellendi.');
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Güncellenemedi.');
      throw err;
    }
  };

  const handleToggleLike = async (feelingId) => {
    if (!user) {
      Alert.alert('Uyarı', 'Beğenmek için giriş yapmalısınız.');
      return;
    }
    // Optimistic UI update
    setFeelings(prev => prev.map(f => {
      if (f.id === feelingId) {
        const isLiked = f.is_liked_by_user;
        return {
          ...f,
          is_liked_by_user: !isLiked,
          like_count: isLiked ? (f.like_count || 1) - 1 : (f.like_count || 0) + 1
        };
      }
      return f;
    }));

    try {
      await feelingsApi.toggleLike(feelingId);
    } catch (err) {
      // Revert on error
      fetchFeelings();
      console.log('Beğeni hatası:', err.message);
    }
  };

  return (
    <View className="px-5 mb-8">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center gap-1.5">
          <Icon name="Sparkle" size={20} color={COLORS.primary} weight="fill" />
          <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary">Bana Hissettirdikleri</Text>
        </View>
        {privileges?.can_post_feelings !== 0 && (
          <TouchableOpacity
            className="bg-brand-primary/10 px-3 py-1.5 rounded-full border border-brand-primary/30"
            onPress={() => setShowForm(!showForm)}
          >
            <Text className="text-brand-primary text-xs font-bold">{showForm ? 'İptal' : '+ Paylaş'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Etiket filtresi */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
        <View className="flex-row gap-2.5 pb-2">
          {EMOTION_TAGS.map((tag) => {
            const isSelected = tagFilter === tag.id;
            const tagColor = COLORS[tag.id] || COLORS.textPrimary;
            return (
              <TouchableOpacity
                key={tag.id}
                className={`flex-row items-center px-3 py-2 rounded-xl border ${isSelected ? 'border-transparent' : 'bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border'}`}
                style={isSelected ? { backgroundColor: `${tagColor}25`, borderColor: tagColor } : {}}
                onPress={() => setTagFilter(isSelected ? null : tag.id)}
              >
                <View className="mr-1.5 bg-white/10 p-1 rounded-md">
                  <Icon name={tag.iconName} size={14} color={isSelected ? tagColor : COLORS.textSecondary} />
                </View>
                <Text className={`font-bold text-xs ${isSelected ? '' : 'text-text-lightSecondary dark:text-text-darkSecondary'}`} style={isSelected ? { color: tagColor } : {}}>{tag.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Yeni hissettirdikleri formu */}
      {showForm && (
        <View className="bg-light-surfaceElevated dark:bg-dark-surfaceElevated rounded-2xl p-4 mb-4 border border-light-border dark:border-dark-border">
          <Text className="text-sm font-bold text-text-lightPrimary dark:text-text-darkPrimary mb-3">Neler Hissettirdi?</Text>
          <TextInput
            className="bg-light-bg dark:bg-dark-bg rounded-xl px-4 py-3 min-h-[100px] border border-light-border dark:border-dark-border text-sm text-text-lightPrimary dark:text-text-darkPrimary mb-4"
            value={newText}
            onChangeText={setNewText}
            placeholder="Bu içerik sana neler hissettirdi? Özgürce yaz..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <EmotionTagSelector selected={newTags} onToggle={handleToggleTag} />
          <TouchableOpacity
            className={`mt-4 rounded-xl overflow-hidden ${submitting ? 'opacity-60' : ''}`}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <LinearGradient colors={GRADIENTS.primary} className="py-3 items-center" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {submitting ? <ActivityIndicator color="#fff" /> : (
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-white font-bold text-sm">Paylaş</Text>
                  <Icon name="Sparkle" size={16} color="#fff" weight="fill" />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Listele */}
      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : feelings.length === 0 ? (
        <Text className="text-center text-text-lightMuted dark:text-text-darkMuted py-4">
          {tagFilter ? 'Bu etiketle paylaşım yok.' : 'Henüz kimse paylaşmamış. İlk sen ol!'}
        </Text>
      ) : (
        feelings.map((f) => (
          <CommentItem 
            key={f.id} 
            comment={f} 
            isFeeling 
            isOwner={user?.id === f.user_id}
            onEdit={handleEditFeeling}
            onToggleLike={handleToggleLike}
            onDelete={
              isModerator || f.user_id === user?.id 
                ? () => handleDeleteFeeling(f.id) 
                : undefined
            } 
          />
        ))
      )}
    </View>
  );
}



// Ana Detay Ekranı
export default function DetailScreen() {
  const { colors: COLORS, isDark } = useTheme();

  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editCover, setEditCover] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      const res = await contentApi.getById(id);
      setContent(res.data.data);
      navigation.setOptions({ title: res.data.data.title });
    } catch (err) {
      Alert.alert('Hata', 'İçerik yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [id, navigation]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  if (loading) {
    return <View className="flex-1 justify-center items-center bg-light-bg dark:bg-dark-bg"><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  if (!content) {
    return <View className="flex-1 justify-center items-center bg-light-bg dark:bg-dark-bg"><Text className="text-text-lightMuted dark:text-text-darkMuted">İçerik bulunamadı.</Text></View>;
  }

  const typeIcon = content.type === 'movie' ? 'FilmStrip' : content.type === 'series' ? 'Television' : 'Books';
  const typeLabel = content.type === 'movie' ? 'Film' : content.type === 'series' ? 'Dizi' : 'Kitap';
  const authorLabel = content.type === 'book' ? 'Yazar' : 'Yönetmen';

  const handleDeleteContent = () => {
    Alert.alert(
      'İçeriği Sil',
      'Bu içeriği (film/dizi/kitap) tamamen silmek istediğinize emin misiniz? Bütün yorumlar ve hisler de silinecektir. Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await contentApi.delete(id);
              Alert.alert('Başarılı', 'İçerik başarıyla silindi.');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Hata', err.response?.data?.message || 'İçerik silinemedi.');
            }
          },
        },
      ]
    );
  };

  const startEditing = () => {
    setEditTitle(content.title);
    setEditAuthor(content.director_author);
    setEditSummary(content.summary || '');
    setEditCover(null); // Reset cover selection
    setIsEditing(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      if (asset.width !== 1000 || asset.height !== 1500) {
        Alert.alert('Hata', `Resim boyutları 1000x1500 piksel ve 2:3 oranında olmalıdır.\n(Seçilen: ${asset.width}x${asset.height})`);
        return;
      }
      setEditCover(asset);
    }
  };

  const handleSaveEdit = async () => {
    const t = editTitle.trim();
    const d = editAuthor.trim();
    if (!t || !d) {
      Alert.alert('Uyarı', 'Başlık ve yazar/yönetmen zorunludur.');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', t);
      formData.append('director_author', d);
      formData.append('summary', editSummary.trim());
      if (editCover) {
        const filename = editCover.uri.split('/').pop();
        const ext = filename.split('.').pop();
        formData.append('cover_image', {
          uri: editCover.uri,
          name: filename,
          type: `image/${ext}`,
        });
      }
      await contentApi.update(id, formData);
      Alert.alert('Başarılı', 'İçerik başarıyla güncellendi.');
      setIsEditing(false);
      fetchContent();
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Güncellenemedi.');
    } finally {
      setSaving(false);
    }
  };

  const coverUri = content.cover_image ? `${API_BASE_URL}${content.cover_image}` : null;


  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1 bg-light-bg dark:bg-dark-bg">
        {/* Kapak Alanı */}
        <View className="w-full aspect-[2/3] relative bg-light-surfaceElevated dark:bg-dark-surfaceElevated">
          {isEditing && editCover ? (
            <Image source={{ uri: editCover.uri }} className="w-full h-full" contentFit="cover" />
          ) : coverUri ? (
            <Image source={{ uri: coverUri }} className="w-full h-full" contentFit="cover" />
          ) : (
            <View className="w-full h-full justify-center items-center">
              <Icon name={typeIcon} size={80} color={COLORS.textMuted} weight="light" />
            </View>
          )}
          
          {isEditing && (
            <TouchableOpacity 
              onPress={pickImage} 
              className="absolute top-5 right-5 bg-black/60 p-2.5 rounded-[20px] flex-row items-center gap-1.5"
            >
              <Icon name="Camera" size={16} color="#fff" />
              <Text className="text-white text-xs font-semibold">Kapak Değiştir</Text>
            </TouchableOpacity>
          )}
          <LinearGradient colors={['transparent', isDark ? '#121212' : '#F9FAFB']} className="absolute bottom-0 left-0 right-0 h-40" />
        </View>

        {/* İçerik Bilgileri */}
        <View className="px-5 py-6 -mt-16 bg-light-bg dark:bg-dark-bg rounded-t-3xl border-t border-light-border dark:border-dark-border">
          <View className="flex-row justify-between items-start mb-2.5">
            <View className="bg-brand-primary/10 px-3 py-1.5 rounded-full border border-brand-primary/20">
              <View className="flex-row items-center gap-1">
                <Icon name={typeIcon} size={14} color={COLORS.primary} weight="bold" />
                <Text className="text-brand-primary font-bold text-xs uppercase tracking-wider">{typeLabel}</Text>
              </View>
            </View>
            
            {isAdmin && !isEditing && (
              <View className="flex-row gap-2">
                <TouchableOpacity 
                  onPress={startEditing} 
                  className="bg-brand-primary/20 px-2.5 py-1.5 rounded-lg border border-brand-primary/50 flex-row items-center gap-1"
                >
                  <Icon name="Pencil" size={14} color={COLORS.primary} weight="bold" />
                  <Text className="text-brand-primary text-xs font-bold">Düzenle</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleDeleteContent} 
                  className="bg-status-error/20 px-2.5 py-1.5 rounded-lg border border-status-error/50 flex-row items-center gap-1"
                >
                  <Icon name="Trash" size={14} color="#ef4444" weight="bold" />
                  <Text className="text-status-error text-xs font-bold">Sil</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {isEditing ? (
            <View className="gap-3 mb-5">
              <View>
                <Text className="text-text-lightSecondary dark:text-text-darkSecondary text-xs mb-1">Başlık</Text>
                <TextInput className="bg-light-surfaceElevated dark:bg-dark-surfaceElevated text-text-lightPrimary dark:text-text-darkPrimary rounded-xl p-3 border border-light-border dark:border-dark-border min-h-[40px] text-sm" value={editTitle} onChangeText={setEditTitle} />
              </View>
              <View>
                <Text className="text-text-lightSecondary dark:text-text-darkSecondary text-xs mb-1">{authorLabel}</Text>
                <TextInput className="bg-light-surfaceElevated dark:bg-dark-surfaceElevated text-text-lightPrimary dark:text-text-darkPrimary rounded-xl p-3 border border-light-border dark:border-dark-border min-h-[40px] text-sm" value={editAuthor} onChangeText={setEditAuthor} />
              </View>
              <View>
                <Text className="text-text-lightSecondary dark:text-text-darkSecondary text-xs mb-1">Özet</Text>
                <TextInput className="bg-light-surfaceElevated dark:bg-dark-surfaceElevated text-text-lightPrimary dark:text-text-darkPrimary rounded-xl p-3 border border-light-border dark:border-dark-border h-[100px] text-sm" value={editSummary} onChangeText={setEditSummary} multiline textAlignVertical="top" />
              </View>
              <View className="flex-row gap-3 mt-2">
                <TouchableOpacity className="flex-1 p-3 rounded-xl items-center bg-light-surfaceElevated dark:bg-dark-surfaceElevated" onPress={() => setIsEditing(false)}>
                  <Text className="text-text-lightPrimary dark:text-text-darkPrimary font-semibold">İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 p-3 rounded-xl items-center bg-brand-primary flex-row justify-center gap-2" onPress={handleSaveEdit} disabled={saving}>
                  {saving ? <ActivityIndicator size="small" color="#fff" /> : (
                    <>
                      <Icon name="Check" size={16} color="#fff" weight="bold" />
                      <Text className="text-white font-semibold">Kaydet</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text className="text-3xl font-extrabold text-text-lightPrimary dark:text-text-darkPrimary mb-1 tracking-tight">{content.title}</Text>
              <Text className="text-base text-text-lightSecondary dark:text-text-darkSecondary font-medium mb-5">{authorLabel}: {content.director_author}</Text>
              {content.summary ? (
                <View className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border-l-4 border-brand-primary">
                  <Text className="text-sm font-bold text-text-lightPrimary dark:text-text-darkPrimary mb-2">Özet</Text>
                  <Text className="text-sm leading-6 text-text-lightSecondary dark:text-text-darkSecondary">{content.summary}</Text>
                </View>
              ) : null}
            </>
          )}

          {/* En Çok Hissedilen Duygular (Detay Sayfası) */}
          {content.top_emotions && content.top_emotions.length > 0 && (
            <View className="mt-3 pb-2">
              <Text className="text-[13px] font-bold text-text-lightSecondary dark:text-text-darkSecondary mb-2">Bu içerikte en çok hissedilenler:</Text>
              <View className="flex-row flex-wrap gap-1.5">
                {content.top_emotions.map(tagId => {
                  const tagData = EMOTION_TAGS.find(t => t.id === tagId);
                  if (!tagData) return null;
                  const tagColor = COLORS[tagId] || COLORS.textPrimary;
                  return (
                    <View key={tagId} className="flex-row items-center px-2.5 py-1.5 rounded-xl border gap-1" style={{ backgroundColor: `${tagColor}15`, borderColor: `${tagColor}40` }}>
                      <Icon name={tagData.iconName} size={14} color={tagColor} weight="fill" />
                      <Text className="text-xs font-bold" style={{ color: tagColor }}>{tagData.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <LibraryStatusSelector contentId={id} type={content.type} />
        </View>

        {/* Yorumlar ve Hissettirdikleri — BIRBIRINDEN AYRI */}
        <CommentsSection contentId={id} />
        <FeelingsSection contentId={id} />

        <View className="h-12" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
