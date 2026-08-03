const fs = require('fs');
const path = require('path');

const directoriesToSearch = ['app', 'src'];

const replacements = {
  '@/components/PasswordValidator': '@/features/auth/components/PasswordValidator',
  '@/components/RememberMeCheckbox': '@/features/auth/components/RememberMeCheckbox',
  '@/components/SearchBar': '@/features/content/components/SearchBar',
  '@/components/ContentCard': '@/features/content/components/ContentCard',
  '@/components/CommentItem': '@/features/comments/components/CommentItem',
  '@/components/UserCommentItem': '@/features/comments/components/UserCommentItem',
  '@/components/EmotionTagSelector': '@/features/feelings/components/EmotionTagSelector',
  '@/components/EmotionDiscovery': '@/features/feelings/components/EmotionDiscovery',
  '@/components/ThemeToggle': '@/components/ui/ThemeToggle',
};

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const [oldImport, newImport] of Object.entries(replacements)) {
        if (content.includes(oldImport)) {
          content = content.replace(new RegExp(oldImport, 'g'), newImport);
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated imports in ${fullPath}`);
      }
    }
  }
}

directoriesToSearch.forEach(processDirectory);
console.log('Done');
