import React from 'react';
import { TouchableOpacity } from 'react-native';

import ContentCardCover from './ContentCardCover';
import ContentCardInfo from './ContentCardInfo';

export default function ContentCard({ item, onPress, showLatestComment = false }) {
  return (
    <TouchableOpacity 
      className="flex-col w-full bg-light-card dark:bg-dark-card rounded-2xl overflow-hidden border border-light-border dark:border-dark-border mb-4" 
      onPress={onPress} 
      activeOpacity={0.85}
    >
      <ContentCardCover coverImage={item.cover_image} />
      
      <ContentCardInfo 
        item={item} 
        showLatestComment={showLatestComment} 
      />
    </TouchableOpacity>
  );
}
