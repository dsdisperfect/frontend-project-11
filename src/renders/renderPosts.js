export default (instance, state, elements) => {
  const ul = elements.postsList.querySelector('ul');
  ul.replaceChildren();
  state.posts.forEach((post) => {
    const list = document.createElement('li');
    list.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const link = document.createElement('a');
    if (!state.visitedPosts.includes(post.id)) {
      link.classList.add('fw-bold');
    } else {
      link.classList.add('fw-normal', 'link-secondary');
    }
    link.setAttribute('href', `${post.link}`);
    link.setAttribute('target', '_blank');
    link.textContent = post.title;
    link.dataset.id = post.id;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('type', 'button');
    button.textContent = instance.t('results.modal.open');
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.dataset.id = post.id;

    list.append(link, button);
    ul.append(list);
  });
};
