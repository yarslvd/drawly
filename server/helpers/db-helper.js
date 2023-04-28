async function processPagination(url, path, model, limit, page, attr) {
  let all;
  let pages;

  const customAttr = { ...attr };

  const count = await model.count(customAttr);

  pages = Math.ceil(count / limit);

  if (count > limit) {
    customAttr.limit = limit;
    customAttr.offset = page * limit;
  }
  if (!customAttr.hasOwnProperty("order")) {
    customAttr.order = [["id", "DESC"]];
  }

  all = await model.findAndCountAll(customAttr);

  all.count = count;
  all.links = getLinks(page, pages, url, path);
  all.pages = pages;

  return all;
}

function getLinks(page, pages, url, path) {
  let prev = page - 1;
  if (page === 0) {
    prev = 0;
  }

  let next = page + 1;
  if (page + 1 === pages) {
    next = page;
  }

  return {
    prev: `${url}${path.replace(`page=${page}`, `page=${prev}`)}`,
    self: `${url}${path.replace(`page=${page}`, `page=${page}`)}`,
    next: `${url}${path.replace(`page=${page}`, `page=${next}`)}`,
  };
}

module.exports = {
  processPagination,
};
