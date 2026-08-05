import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from '@/features/icon/components/Icon';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLibraryStatus } from './useLibraryStatus';
import { getBookStatusOptions, getMediaStatusOptions } from '@/constants/library';
import { useLanguage } from '@/hooks/useLanguage';

export default function LibraryStatusSelector({ contentId, type }) {
  const { colors: COLORS } = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const { state, actions } = useLibraryStatus(contentId, user);
  const { status, counts, loading } = state;

  // We can show counts even to non-logged users. But if user wants interactions, they need to log in.
  // Actually, we show the whole component if it's available.
  const options = type === 'book' ? getBookStatusOptions(t) : getMediaStatusOptions(t);

  return (
    <View className="mt-5 mb-2.5">
      <Text className="text-text-lightSecondary dark:text-text-darkSecondary text-[13px] font-semibold mb-2 uppercase tracking-wide">
        {t('library.myLibrary')}
      </Text>
      
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.primary} className="self-start" />
      ) : (
        <View className="flex-row gap-2 flex-wrap">
          {options.map(opt => {
            const isActive = status === opt.id;
            const count = counts[opt.id] || 0;
            
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => actions.handleSelectStatus(opt.id)}
                className={`flex-row items-center gap-1.5 px-3 py-2 rounded-[20px] border ${
                  isActive 
                    ? 'bg-brand-primary border-brand-primary' 
                    : 'bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border'
                }`}
              >
                <Icon 
                  name={opt.icon} 
                  size={16} 
                  color={isActive ? '#fff' : COLORS.textPrimary} 
                  weight={isActive ? "fill" : "regular"} 
                />
                <Text 
                  className={`text-[13px] font-semibold ${
                    isActive ? 'text-white' : 'text-text-lightPrimary dark:text-text-darkPrimary'
                  }`}
                >
                  {opt.label} {count > 0 ? `(${count})` : ''}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      )}
    </View>
  );
}
