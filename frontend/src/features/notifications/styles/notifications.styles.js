export const notificationsStyles = {
  mainContainer: "flex-1 bg-light-bg dark:bg-dark-bg",
  
  headerContainer: "flex-row justify-between items-center px-5 pt-16 pb-4 border-b border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface",
  headerTitle: "text-2xl font-extrabold text-text-lightPrimary dark:text-text-darkPrimary",
  
  centerContainer: "flex-1 justify-center items-center",
  emptyText: "mt-4 text-base text-text-lightMuted dark:text-text-darkMuted",
  
  itemContainerBase: "flex-row items-center p-4 border-b",
  itemContainerUnread: "bg-light-surfaceElevated dark:bg-dark-surfaceElevated border-light-border dark:border-dark-border",
  itemContainerRead: "bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border",
  
  itemIconContainer: "mr-4",
  itemTextContainer: "flex-1",
  
  itemMessageBase: "text-[15px] mb-1",
  itemMessageUnread: "text-text-lightPrimary dark:text-text-darkPrimary font-bold",
  itemMessageRead: "text-text-lightSecondary dark:text-text-darkSecondary font-normal",
  
  itemDate: "text-xs text-text-lightMuted dark:text-text-darkMuted",
  unreadDot: "w-2.5 h-2.5 rounded-full ml-2.5 bg-brand-primary",
};
