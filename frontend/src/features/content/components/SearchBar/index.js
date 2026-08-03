import React from 'react';
import { View } from 'react-native';

import SearchInput from './SearchInput';
import SearchTagFilter from './SearchTagFilter';

/**
 * SearchBar — Evrensel arama komponenti
 * Kitap, Film ve Dizi ekranlarında ortak kullanılır
 * Duygu etiketi filtresi (showTagFilter=true ile açılır)
 */
export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Ara...',
  showTagFilter = false,
  selectedTag = null,
  onTagSelect = () => {},
}) {
  return (
    <View className="mb-2 pt-2 px-4">
      <SearchInput 
        value={value} 
        onChangeText={onChangeText} 
        placeholder={placeholder} 
      />
      
      {showTagFilter && (
        <SearchTagFilter 
          selectedTag={selectedTag} 
          onTagSelect={onTagSelect} 
        />
      )}
    </View>
  );
}
