import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cardContainer: {
    padding: 24,
    borderRadius: 20,
    marginVertical: 20,
    // Add a soft inner shadow or solid border for Instagram aesthetic
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  quoteText: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  watermark: {
    marginTop: 24,
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.5,
    letterSpacing: 2,
  },
  
  // Emotion Layout Styles
  emotionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emotionTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  emotionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: 20,
  },
  
  // Similarity Layout Styles
  similarityAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  similarityAvatarMain: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    zIndex: 2,
  },
  similarityAvatarSecondary: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    marginLeft: -15,
    zIndex: 1,
  },
  similarityPercentage: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 4,
  },
  similarityText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
  }
});
