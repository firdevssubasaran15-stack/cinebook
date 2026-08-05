export const userProfileStyles = {
  loadingContainer: "flex-1 justify-center items-center bg-light-bg dark:bg-dark-bg",
  mainContainer: "flex-1 bg-light-bg dark:bg-dark-bg",

  headerGradient: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backButton: { position: 'absolute', top: 50, left: 20, padding: 10, zIndex: 10 },
  calendarButton: { position: 'absolute', top: 50, right: 20, padding: 10, zIndex: 10 },
  
  profileInfoContainer: { alignItems: 'center', marginBottom: 24 },
  profileImage: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  profileImageFallback: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  profileImageFallbackText: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  username: { fontSize: 22, fontWeight: '800', marginBottom: 4, textAlign: 'center' },
  joinDate: { fontSize: 12, textAlign: 'center' },
  
  emotionContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  emotionLabel: { fontSize: 13, marginRight: 6 },
  emotionBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  emotionBadgeText: { fontSize: 13, fontWeight: 'bold' },
  
  similarityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  similarityText: { fontSize: 13, fontWeight: 'bold', marginLeft: 6 },
  
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  statItem: { alignItems: 'center', paddingHorizontal: 24 },
  statValue: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 13 },
  statDivider: { width: 1, height: 28 },
  
  actionButtonBase: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 9999, minWidth: 160, alignItems: 'center', borderWidth: 1 },
  actionButtonText: { fontSize: 15, fontWeight: 'bold' },

  searchContainer: "mx-5 mt-5 mb-2.5 z-[99]",
  searchInputRow: "flex-row items-center rounded-2xl px-4 py-3 border bg-light-surfaceElevated border-light-border dark:bg-black/5 dark:border-dark-border",
  searchInput: "flex-1 ml-3 text-base text-text-lightPrimary dark:text-text-darkPrimary",
  searchResultsContainer: "mt-2 rounded-2xl p-2 border bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border",
  searchResultItem: "flex-row items-center p-3 rounded-xl",
  searchResultImage: "w-9 h-9 rounded-full mr-3",
  searchResultImageFallback: "w-9 h-9 rounded-full mr-3 bg-brand-primary justify-center items-center",
  searchResultText: "font-medium text-text-lightPrimary dark:text-text-darkPrimary",

  tabsContainer: "flex-row mx-5 mb-2.5 rounded-xl p-1 bg-light-surfaceElevated dark:bg-black/5",
  tabButtonBase: "flex-1 py-2.5 items-center rounded-lg",
  tabButtonActive: "bg-brand-primary",
  tabButtonInactive: "bg-transparent",
  tabTextActive: "font-bold text-white",
  tabTextInactive: "font-bold text-text-lightSecondary dark:text-text-darkSecondary",
  
  emptyContainer: "p-10 items-center justify-center",
  emptyText: "mt-3 text-[15px] text-text-lightSecondary dark:text-text-darkSecondary",
  
  listItem: "mx-5 mb-3 p-4 rounded-2xl flex-row items-center border bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border",
  listTitle: "text-base font-bold text-text-lightPrimary dark:text-text-darkPrimary",
  listStatsRow: "flex-row items-center mt-2 gap-3",
  listStatItem: "flex-row items-center",
  listStatText: "text-xs ml-1 text-text-lightSecondary dark:text-text-darkSecondary",

  modalOverlay: "flex-1 justify-center items-center bg-black/50",
  listModalContainer: "w-[85%] max-h-[70%] rounded-3xl p-5 bg-light-bg dark:bg-dark-bg",
  modalHeaderRow: "flex-row justify-between items-center mb-4",
  modalTitle: "text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary",
  
  modalUserItem: "flex-row items-center py-2.5 border-b border-light-border dark:border-dark-border",
  modalUserImage: "w-10 h-10 rounded-full mr-3",
  modalUserImageFallback: "w-10 h-10 rounded-full mr-3 bg-brand-primary justify-center items-center",
  modalUserText: "text-base font-medium text-text-lightPrimary dark:text-text-darkPrimary",

  editModalContainer: "w-[85%] rounded-3xl p-6 items-center bg-light-bg dark:bg-dark-bg",
  editImageButton: "relative mb-6",
  editImagePreview: "w-[100px] h-[100px] rounded-full",
  editImageFallback: "w-[100px] h-[100px] rounded-full bg-brand-primary justify-center items-center",
  editImageFallbackText: "text-white text-4xl font-bold",
  editIconContainer: "absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-primary justify-center items-center border-2 border-light-bg dark:border-dark-bg",
  
  editInputLabel: "text-sm mb-2 text-text-lightSecondary dark:text-text-darkSecondary",
  editInput: "w-full h-12 rounded-xl px-4 text-base border bg-light-surfaceElevated border-light-border text-text-lightPrimary dark:bg-dark-surfaceElevated dark:border-dark-border dark:text-text-darkPrimary",
  
  editButtonsRow: "flex-row gap-3 w-full",
  editCancelButton: "flex-1 py-3 rounded-xl items-center border bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border",
  editCancelText: "font-semibold text-text-lightPrimary dark:text-text-darkPrimary",
  editSaveButton: "flex-1 py-3 rounded-xl items-center bg-brand-primary",
  editSaveText: "text-white font-semibold",
};
