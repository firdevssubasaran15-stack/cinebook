import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image as RNImage } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { GRADIENTS } from '@/constants/colors';
import { useAddContent } from '@/features/admin/hooks/useAddContent';
import { styles } from './styles';

const CONTENT_TYPES = [
  { value: 'movie', label: '🎬 Film' },
  { value: 'series', label: '📺 Dizi' },
  { value: 'book', label: '📚 Kitap' },
];

export default function AddContentForm({ onSuccess }) {
  const { colors: COLORS } = useTheme();
  
  const {
    type, setType,
    title, setTitle,
    directorAuthor, setDirectorAuthor,
    summary, setSummary,
    coverImage,
    loading,
    pickImage,
    handleSubmit
  } = useAddContent(onSuccess);

  return (
    <View className={styles.container}>
      <Text className={styles.title}>📦 Yeni İçerik Ekle</Text>

      {/* Tür Seçimi */}
      <Text className={styles.sectionLabel}>İçerik Türü</Text>
      <View className={styles.typeContainer}>
        {CONTENT_TYPES.map((ct) => (
          <TouchableOpacity
            key={ct.value}
            className={`${styles.typeButton} ${type === ct.value ? styles.typeButtonActive : styles.typeButtonInactive}`}
            onPress={() => setType(ct.value)}
          >
            <Text className={type === ct.value ? styles.typeButtonTextActive : styles.typeButtonTextInactive}>
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
        <View key={field.label} className={styles.inputContainer}>
          <Text className={styles.sectionLabel}>{field.label}</Text>
          <TextInput
            className={styles.textInput}
            value={field.value}
            onChangeText={field.onChange}
            placeholder={field.placeholder}
            placeholderTextColor={COLORS.textMuted}
          />
        </View>
      ))}

      <View className={styles.inputContainer}>
        <Text className={styles.sectionLabel}>Özet</Text>
        <TextInput
          className={styles.textArea}
          value={summary}
          onChangeText={setSummary}
          placeholder="Kısa özet..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Kapak Resmi */}
      <TouchableOpacity className={styles.imagePickerContainer} onPress={pickImage}>
        {coverImage ? (
          <RNImage source={{ uri: coverImage.uri }} className={styles.previewImage} resizeMode="cover" />
        ) : (
          <Text className={styles.imagePickerText}>🖼️ Kapak Resmi Seç</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className={`${styles.submitButtonContainer} ${loading ? 'opacity-60' : ''}`}
        onPress={handleSubmit}
        disabled={loading}
      >
        <LinearGradient 
          colors={GRADIENTS.primary} 
          className={styles.submitButtonGradient} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 0 }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text className={styles.submitButtonText}>İçerik Ekle</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
