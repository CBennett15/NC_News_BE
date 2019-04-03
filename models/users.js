exports.getUsersByUsername = () => {};

exports.getArticlesById = ({ articles_id }) => {
  return connection
    .select('articles.*', 'comments.article_id')
    .from('articles')
    .where('articles.article_id', '=', articles_id)
    .count({ comment_count: 'comments.article_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('comments.article_id', 'articles.article_id');
};
