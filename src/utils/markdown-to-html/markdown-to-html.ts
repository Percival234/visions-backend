import { marked } from 'marked';

export const markdownToHTML = async (markdown: string) => {
  const html = await marked(
    markdown.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, ''),
  );

  return html;
};
