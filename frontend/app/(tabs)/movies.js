import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { contentApi } from '@/api/endpoints/content.api';
import ContentCard from '@/features/content/components/ContentCard';
import SearchBar from '@/features/content/components/SearchBar';
import EmotionDiscovery from '@/features/feelings/components/EmotionDiscovery';
import { useTheme } from '@/context/ThemeContext';

export default function MoviesScreen() {
  const { colors: COLORS } = useTheme();

  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMovies = useCallback(async () => {
    try {
      const res = await contentApi.getByType('movie', search);
      setMovies(res.data.data);
    } catch (err) {
      console.log('Movies fetch error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchMovies, 400);
    return () => clearTimeout(timer);
  }, [fetchMovies]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-light-bg dark:bg-dark-bg">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-light-bg dark:bg-dark-bg">
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Film ara..."
        showTagFilter={false}
      />
      <FlatList
        data={movies}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListHeaderComponent={!search ? <EmotionDiscovery type="movie" /> : null}
        renderItem={({ item }) => (
          <View className="w-[48%]">
            <ContentCard item={item} onPress={() => router.push(`/detail/${item.id}`)} />
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-text-lightMuted dark:text-text-darkMuted mt-8">
            {search ? `"${search}" için sonuç bulunamadı.` : 'Henüz film eklenmemiş.'}
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMovies(); }} tintColor={COLORS.primary} />
        }
      />
    </View>
  );
}
