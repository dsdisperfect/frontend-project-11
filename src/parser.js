export default (xml) => {
  const parser = new DOMParser();
  const page = parser.parseFromString(xml, 'application/xml');

  const errors = page.querySelector('parseerror');
  if (errors !== null) {
    const error = errors.textContent;
    throw new Error(error);
  }

  const posts = Array.from(page.getElementsByTagName('item')).map((el) => ({
    title: el.querySelector('title').textContent,
    description: el.querySelector('description').textContent,
    link: el.querySelector('link').textContent,
  }));
  const feed = {
    feedInfo: {
      title: page.querySelector('title').textContent,
      description: page.querySelector('description').textContent,
    },
    posts,
  };
  return feed;
};
