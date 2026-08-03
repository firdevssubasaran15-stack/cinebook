import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image as RNImage,
} from 'react-native';
import { Redirect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { contentApi } from '@/api/endpoints/content.api';
import { adminApi } from '@/api/endpoints/admin.api';
import { GRADIENTS } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';

const CONTENT_TYPES = [
  { value: 'movie', label: '🎬 Film' },
  { value: 'series', label: '📺 Dizi' },
  { value: 'book', label: '📚 Kitap' },
];

const SHORT_TITLE_WHITELIST = [
  { type: 'book', title: 'K', author: 'Franz Kafka' },
  { type: 'book', title: 'V.', author: 'Thomas Pynchon' },
  { type: 'book', title: 'O', author: 'Stephen King' },
  { type: 'movie', title: 'Z', author: 'Costa-Gavras' },
  { type: 'movie', title: '9', author: 'Shane Acker' },
  { type: 'movie', title: 'O', author: 'Tim Blake Nelson' },
  { type: 'series', title: 'V', author: 'Kenneth Johnson' },
  { type: 'series', title: 'V', author: 'Scott Peters' },
  { type: 'series', title: 'K', author: 'GoHands' },
  { type: 'series', title: 'K', author: 'Shingo Suzuki' },
  { type: 'series', title: 'ER', author: 'Michael Crichton' },
];

function AddContentForm({ onSuccess }) {
  const { colors: COLORS } = useTheme();
  const [type, setType] = useState('movie');
  const [title, setTitle] = useState('');
  const [directorAuthor, setDirectorAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setCoverImage(asset);
    }
  };

  const handleSubmit = async () => {
    const t = title.trim();
    const d = directorAuthor.trim();
    
    if (!t || !d) {
      Alert.alert('Uyarı', 'Başlık ve yönetmen/yazar zorunludur.');
      return;
    }

    if (t.length === 1 || t === 'V.' || t.toUpperCase() === 'ER') {
      const isWhitelisted = SHORT_TITLE_WHITELIST.some(w => {
        if (w.type !== type || w.title.toLowerCase() !== t.toLowerCase()) return false;
        
        // Yazar/yönetmen eşleştirmesini daha esnek yapalım (Kelime bazlı)
        const whiteWords = w.author.toLowerCase().split(/\s+/);
        const inputWords = d.toLowerCase().split(/\s+/);
        
        // Kullanıcının girdiği kelimelerden en az biri (uzunluğu > 2) whitelist'te varsa kabul et
        return inputWords.some(word => word.length > 2 && whiteWords.includes(word)) || 
               w.author.toLowerCase().includes(d.toLowerCase());
      });

      if (!isWhitelisted) {
        Alert.alert('Hata', 'Tek harfli/rakamlı veya kısıtlanmış kısa isimler yalnızca özel istisna listesine uyan yönetmen/yazarlarla girilebilir.');
        return;
      }
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('title', t);
      formData.append('director_author', d);
      formData.append('summary', summary.trim());

      if (coverImage) {
        const filename = coverImage.uri.split('/').pop();
        const ext = filename.split('.').pop();
        formData.append('cover_image', {
          uri: coverImage.uri,
          name: filename,
          type: `image/${ext}`,
        });
      }

      await contentApi.create(formData);
      Alert.alert('Başarılı', 'İçerik başarıyla eklendi!');
      setTitle('');
      setDirectorAuthor('');
      setSummary('');
      setCoverImage(null);
      onSuccess?.();
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'İçerik eklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-light-surfaceElevated dark:bg-dark-surfaceElevated rounded-2xl p-5 mb-5 border border-light-border dark:border-dark-border shadow-sm">
      <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary mb-4">📦 Yeni İçerik Ekle</Text>

      {/* Tür Seçimi */}
      <Text className="text-[13px] font-bold text-text-lightSecondary dark:text-text-darkSecondary mb-2">İçerik Türü</Text>
      <View className="flex-row gap-2 mb-4">
        {CONTENT_TYPES.map((ct) => (
          <TouchableOpacity
            key={ct.value}
            className={`flex-1 py-2 rounded-xl items-center border ${type === ct.value ? 'bg-brand-primary border-brand-primary' : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border'}`}
            onPress={() => setType(ct.value)}
          >
            <Text className={`text-[13px] font-bold ${type === ct.value ? 'text-white' : 'text-text-lightSecondary dark:text-text-darkSecondary'}`}>
              {ct.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Form Alanları */}
      {[
        { label: 'Başlık', value: title, onChange: setTitle, placeholder: 'İçerik adı...' },
        { label: type === 'book' ? 'Yazar' : 'Yönetmen', value: directorAuthor, onChange: setDirectorAuthor, placeholder: 'Yazar/Yönetmen adı...' },
      ].map((field) => (
        <View key={field.label} className="mb-4">
          <Text className="text-[13px] font-bold text-text-lightSecondary dark:text-text-darkSecondary mb-2">{field.label}</Text>
          <TextInput
            className="bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-text-lightPrimary dark:text-text-darkPrimary rounded-xl px-4 py-3 h-12 text-sm"
            value={field.value}
            onChangeText={field.onChange}
            placeholder={field.placeholder}
            placeholderTextColor={COLORS.textMuted}
          />
        </View>
      ))}

      <View className="mb-4">
        <Text className="text-[13px] font-bold text-text-lightSecondary dark:text-text-darkSecondary mb-2">Özet</Text>
        <TextInput
          className="bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-text-lightPrimary dark:text-text-darkPrimary rounded-xl px-4 py-3 min-h-[80px] text-sm"
          value={summary}
          onChangeText={setSummary}
          placeholder="Kısa özet..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Kapak Resmi */}
      <TouchableOpacity className="bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border border-dashed rounded-xl h-[120px] justify-center items-center overflow-hidden mb-5" onPress={pickImage}>
        {coverImage ? (
          <RNImage source={{ uri: coverImage.uri }} className="w-[80px] h-[120px]" resizeMode="cover" />
        ) : (
          <Text className="text-text-lightMuted dark:text-text-darkMuted font-semibold">🖼️ Kapak Resmi Seç</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className={`rounded-xl overflow-hidden shadow-sm ${loading ? 'opacity-60' : ''}`}
        onPress={handleSubmit}
        disabled={loading}
      >
        <LinearGradient colors={GRADIENTS.primary} className="py-3.5 items-center justify-center" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-[15px] font-bold">İçerik Ekle</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function PrivilegeManager() {
  const { colors: COLORS } = useTheme();
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [privileges, setPrivileges] = useState({});
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  const PRIVILEGE_LABELS = {
    can_comment: '💬 Yorum Yapabilir',
    can_post_feelings: '💫 Hissettirdikleri Paylaşabilir',
    can_view_movies: '🎬 Filmleri Görebilir',
    can_view_series: '📺 Dizileri Görebilir',
    can_view_books: '📚 Kitapları Görebilir',
    can_view_admin_panel: '⚙️ Admin Panelini Görebilir',
    can_moderate_content: '🗑️ İçerikleri Silebilir (Moderatör)',
  };

  const handleSearch = async () => {
    if (!searchUsername.trim()) return;
    setSearching(true);
    try {
      const res = await adminApi.searchUser(searchUsername.trim());
      setSearchResults(res.data.data);
    } catch (err) {
      Alert.alert('Hata', 'Arama başarısız.');
    } finally {
      setSearching(false);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setPrivileges({
      can_comment: !!user.can_comment,
      can_post_feelings: !!user.can_post_feelings,
      can_view_movies: !!user.can_view_movies,
      can_view_series: !!user.can_view_series,
      can_view_books: !!user.can_view_books,
      can_view_admin_panel: !!user.can_view_admin_panel,
      can_moderate_content: !!user.can_moderate_content,
    });
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await adminApi.updatePrivileges(selectedUser.id, privileges);
      Alert.alert('Başarılı', `${selectedUser.username} kullanıcısının yetkileri güncellendi.`);
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Yetkiler güncellenemedi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="bg-light-surfaceElevated dark:bg-dark-surfaceElevated rounded-2xl p-5 mb-5 border border-light-border dark:border-dark-border shadow-sm">
      <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary mb-4">👤 Kullanıcı Yetki Yönetimi</Text>

      <View className="flex-row gap-2.5 mb-4">
        <TextInput
          className="flex-1 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-text-lightPrimary dark:text-text-darkPrimary rounded-xl px-4 py-3 h-12 text-sm"
          value={searchUsername}
          onChangeText={setSearchUsername}
          placeholder="Kullanıcı adı ara..."
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity className="w-12 h-12 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl justify-center items-center" onPress={handleSearch} disabled={searching}>
          {searching ? <ActivityIndicator color={COLORS.primary} size="small" /> : <Text className="text-base">🔍</Text>}
        </TouchableOpacity>
      </View>

      {/* Arama Sonuçları */}
      {searchResults.map((u) => (
        <TouchableOpacity
          key={u.id}
          className={`flex-row items-center p-3 rounded-xl mb-2 border ${selectedUser?.id === u.id ? 'bg-brand-primary/10 border-brand-primary/30' : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border'}`}
          onPress={() => selectUser(u)}
        >
          <View className="w-10 h-10 rounded-full bg-brand-primary justify-center items-center mr-3">
            <Text className="text-white font-bold text-[15px]">{u.username[0].toUpperCase()}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-bold text-text-lightPrimary dark:text-text-darkPrimary">{u.username}</Text>
            <Text className="text-xs text-text-lightSecondary dark:text-text-darkSecondary mt-0.5">{u.email}</Text>
          </View>
          {u.is_admin ? <Text className="bg-status-error px-2 py-0.5 rounded text-white text-[10px] font-bold ml-2">ADMIN</Text> : null}
        </TouchableOpacity>
      ))}

      {/* Privilege Checkbox'ları */}
      {selectedUser && !selectedUser.is_admin && (
        <View className="mt-4 p-4 bg-light-bg dark:bg-dark-bg rounded-xl border border-light-border dark:border-dark-border">
          <Text className="text-[15px] font-bold text-text-lightPrimary dark:text-text-darkPrimary mb-3 pb-3 border-b border-light-border dark:border-dark-border">
            {selectedUser.username} için Yetkiler
          </Text>
          {Object.entries(PRIVILEGE_LABELS).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              className="flex-row items-center py-2.5"
              onPress={() => setPrivileges((prev) => ({ ...prev, [key]: !prev[key] }))}
            >
              <View className={`w-5 h-5 rounded-[5px] border justify-center items-center mr-3 ${privileges[key] ? 'bg-brand-primary border-brand-primary' : 'bg-light-surfaceElevated dark:bg-dark-surfaceElevated border-light-border dark:border-dark-border'}`}>
                {privileges[key] && <Text className="text-white text-xs font-bold leading-[14px]">✓</Text>}
              </View>
              <Text className="text-[13px] text-text-lightPrimary dark:text-text-darkPrimary flex-1">{label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            className={`mt-4 rounded-xl overflow-hidden shadow-sm ${saving ? 'opacity-60' : ''}`}
            onPress={handleSave}
            disabled={saving}
          >
            <LinearGradient colors={GRADIENTS.primary} className="py-3 items-center justify-center" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-[15px] font-bold">Yetkileri Kaydet</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function BroadcastManager() {
  const { colors: COLORS } = useTheme();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleBroadcast = async () => {
    if (!message.trim()) {
      Alert.alert('Uyarı', 'Lütfen gönderilecek duyuru metnini girin.');
      return;
    }
    
    setSending(true);
    try {
      const res = await adminApi.broadcastNotification(message.trim());
      Alert.alert('Başarılı', res.data.message || 'Duyuru gönderildi.');
      setMessage('');
    } catch (err) {
      Alert.alert('Hata', err.response?.data?.message || 'Duyuru gönderilemedi.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View className="bg-light-surfaceElevated dark:bg-dark-surfaceElevated rounded-2xl p-5 mb-5 border border-light-border dark:border-dark-border shadow-sm">
      <Text className="text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary mb-4">📢 Genel Duyuru Gönder</Text>
      <Text className="text-text-lightSecondary dark:text-text-darkSecondary mb-4 text-[13px] leading-[18px]">
        Buraya yazacağınız mesaj sistemde bildirimleri açık olan tüm kullanıcılara gönderilecektir.
      </Text>
      
      <View className="mb-4">
        <Text className="text-[13px] font-bold text-text-lightSecondary dark:text-text-darkSecondary mb-2">Duyuru Mesajı</Text>
        <TextInput
          className="bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-text-lightPrimary dark:text-text-darkPrimary rounded-xl px-4 py-3 min-h-[100px] text-sm"
          value={message}
          onChangeText={setMessage}
          placeholder="Tüm kullanıcılara gidecek mesaj..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        className={`rounded-xl overflow-hidden shadow-sm ${sending ? 'opacity-60' : ''}`}
        onPress={handleBroadcast}
        disabled={sending}
      >
        <LinearGradient colors={GRADIENTS.primary} className="py-3 items-center justify-center" start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          {sending ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-[15px] font-bold">Duyuruyu Gönder</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

export default function AdminDashboard() {
  const { colors: COLORS } = useTheme();

  const { isAdmin, privileges } = useAuth();
  const hasAccess = isAdmin || privileges?.can_view_admin_panel === 1;

  if (!hasAccess) {
    return <Redirect href="/home" />;
  }

  return (
    <ScrollView className="flex-1 bg-light-bg dark:bg-dark-bg" contentContainerStyle={{ paddingBottom: 48 }}>
      <LinearGradient colors={GRADIENTS.hero} className="pt-[60px] pb-5 px-5 rounded-b-3xl items-center shadow-md">
        <Text className="text-[28px] font-extrabold text-white tracking-tight mb-1">⚙️ Admin Paneli</Text>
        <Text className="text-white/90 text-[15px] font-medium">İçerik ve kullanıcı yönetimi</Text>
      </LinearGradient>

      <View className="p-4 mt-2">
        <BroadcastManager />
        <AddContentForm />
        <PrivilegeManager />
      </View>
    </ScrollView>
  );
}
