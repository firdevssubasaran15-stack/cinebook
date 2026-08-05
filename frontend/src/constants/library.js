export const getLibraryTabs = (t) => [
  { id: 'will_watch', label: t('library.willWatch'), icon: 'BookmarkSimple' },
  { id: 'watched', label: t('library.watched'), icon: 'CheckCircle' },
  { id: 'watching_reading', label: t('library.inProgress'), icon: 'Hourglass' },
  { id: 'will_read', label: t('library.willRead'), icon: 'BookmarkSimple' },
  { id: 'read', label: t('library.read'), icon: 'CheckCircle' },
];

export const getBookStatusOptions = (t) => [
  { id: 'will_read', label: t('library.willRead'), icon: 'BookmarkSimple' },
  { id: 'read', label: t('library.read'), icon: 'CheckCircle' },
  { id: 'reading', label: t('library.inProgress'), icon: 'BookOpen' }
];

export const getMediaStatusOptions = (t) => [
  { id: 'will_watch', label: t('library.willWatch'), icon: 'BookmarkSimple' },
  { id: 'watched', label: t('library.watched'), icon: 'CheckCircle' },
  { id: 'watching', label: t('library.inProgress'), icon: 'MonitorPlay' }
];
