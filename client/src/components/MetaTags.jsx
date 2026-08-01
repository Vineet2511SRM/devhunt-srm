import { useEffect } from 'react';

/**
 * MetaTags Component
 * Updates document title and dynamic OpenGraph/Twitter meta tags
 */
const MetaTags = ({
  title = 'DevHunt SRM — Product Hunt for Campus Developers',
  description = 'Discover, showcase, upvote, and review developer projects created by students and faculty at SRM Institute of Science and Technology.',
  image = '/logo.png',
  url = window.location.href,
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper function to update or create meta tag
    const setMetaTag = (selector, attributeName, attributeValue, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description);

    // 3. Open Graph Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', image);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', url);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');

    // 4. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);
  }, [title, description, image, url]);

  return null;
};

export default MetaTags;
