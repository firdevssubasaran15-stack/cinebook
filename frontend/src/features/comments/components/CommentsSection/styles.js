export const CommentsSectionStyles = {
  container: "px-5 mb-8",
  header: "flex-row items-center gap-1.5 mb-3",
  title: "text-lg font-bold text-text-lightPrimary dark:text-text-darkPrimary",
  emptyState: "text-center text-text-lightMuted dark:text-text-darkMuted py-4",
  listContainer: "gap-4",
};

export const CommentInputStyles = {
  container: "flex-row gap-3 mb-6 bg-light-surfaceElevated border border-light-border dark:bg-dark-surfaceElevated dark:border-dark-border p-3 rounded-2xl",
  inputWrapper: "flex-1 gap-2",
  quoteInput: "text-text-lightPrimary dark:text-text-darkPrimary min-h-[40px] text-[13px] italic py-2",
  textInput: "text-text-lightPrimary dark:text-text-darkPrimary min-h-[40px] text-sm",
  submitButton: "w-12 h-12 bg-brand-primary rounded-xl justify-center items-center self-end",
  submitButtonDisabled: "opacity-60",
};
