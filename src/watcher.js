import onChange from 'on-change';
import renderCard from './renders/renderCard.js';
import renderFeed from './renders/renderFeed.js';
import renderModal from './renders/renderModal.js';
import renderPosts from './renders/renderPosts.js';
import renderError from './renders/renderError.js';

export default (state, instance, elements) => {
  const { form } = elements;
  const watcher = onChange(state, (path, value, prev) => {
    if (path === 'feeds') {
      if (prev.length === 0) {
        renderCard(instance, 'feeds');
        renderCard(instance, 'posts');
      }
      renderFeed(instance, state, elements);
    }

    if (path === 'posts') {
      renderPosts(instance, state, elements);
    }

    if (path === 'modal') {
      renderModal(instance, state, elements);
    }

    if (path === 'form.status') {
      form.querySelector('button').classList.toggle('disabled');
    }

    if (path === 'form.error') {
      renderError(instance, state, elements);
    }
  });
  return watcher;
};
