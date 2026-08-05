export const calendarStyles = {
  loadingContainer: "flex-1 justify-center items-center bg-light-bg dark:bg-dark-bg",
  mainContainer: "flex-1 bg-light-bg dark:bg-dark-bg",

  headerContainer: "flex-row items-center px-2 pt-12 pb-4 border-b bg-light-surfaceElevated border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border",
  backButton: "p-2",
  headerTitle: "text-lg font-bold flex-1 text-center text-text-lightPrimary dark:text-text-darkPrimary",
  headerSpacer: "w-10",

  dayContainerBase: "w-11 h-11 rounded-full justify-center items-center overflow-hidden relative m-0.5",
  dayDisabledText: "text-text-lightMuted dark:text-text-darkMuted",
  dayActiveContainer: "border border-brand-primary",
  dayImage: "absolute w-full h-full opacity-50 bg-black",
  
  dayTextContainer: "z-10",
  dayTextBase: "text-base shadow-sm shadow-black/75",
  dayTextHasData: "text-white",
  dayTextNoData: "text-text-lightPrimary dark:text-text-darkPrimary",
  dayTextTodayHasData: "font-bold text-white",
  dayTextTodayNoData: "font-bold text-brand-primary",
  
  badgeContainer: "absolute top-0.5 right-0.5 bg-status-error rounded-lg px-1 py-0.5 z-20",
  badgeText: "text-white text-[8px] font-bold",

  modalOverlay: "flex-1 justify-end bg-black/50",
  modalContainer: "h-[70%] rounded-t-3xl overflow-hidden bg-light-bg dark:bg-dark-bg",
  modalHeader: "flex-row justify-between items-center p-5 border-b border-light-border dark:border-dark-border",
  modalTitle: "text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary",
  
  modalGrid: "flex-row flex-wrap justify-between",
  modalGridItem: "w-[48%] mb-4",
};
