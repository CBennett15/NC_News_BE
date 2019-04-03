process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe.only('/', () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => connection.destroy());
  describe('/api', () => {
    it('GET status:200', () => {
      return request
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });
    describe('/topics', () => {
      it('GET status: 200, it responds with an array of topic objects each topic having the right properties', () => {
        return request
          .get('/api/topics')
          .expect(200)
          .then((res) => {
            expect(res.body.topics).to.be.an('array');
            expect(res.body.topics[0]).to.contain.keys('description', 'slug');
          });
      });
    });
    describe('/articles', () => {
      it('GET status: 200, it responds with an array of article objects, each topic having the right properties', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then((res) => {
            expect(res.body.articles).to.be.an('array');
            expect(res.body.articles[0]).to.contain.keys(
              'article_id',
              'title',
              'body',
              'votes',
              'topic',
              'author',
              'created_at',
            );
          });
      });
      it('GET status: 200, each article has a comment count property', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then((res) => {
            expect(res.body.articles[0]).to.include.keys('comment_count');
          });
      });
      it('GET status: 200, user can filter by username and return all articles associated with that username', () => {
        return request
          .get('/api/articles?username=butter_bridge')
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).to.equal(3);
          });
      });
      it('GET status: 200, user can filter by topic and return all articles associated with that topic', () => {
        return request
          .get('/api/articles?topic=cats')
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).to.equal(1);
          });
      });
      it('GET status: 200, user can sort the articles by a specific column with default set to Date', () => {
        return request
          .get('/api/articles?sort_by=topic')
          .expect(200)
          .then((res) => {
            expect(res.body.articles[0].topic).to.equal('mitch');
          });
      });
      it('GET status: 200, user can order results by ascending or descending, with defualt set to desc', () => {
        return request
          .get('/api/articles?order_by=asc')
          .expect(200)
          .then((res) => {
            expect(res.body.articles[0].title).to.equal('Moustache');
            expect(
              res.body.articles[res.body.articles.length - 1].title,
            ).to.equal('Living in the shadow of a great man');
          });
      });
      describe('/articles/:article_id', () => {
        it('GET status: 200, it responds with one article object based on article ID', () => {
          return request
            .get('/api/articles/1')
            .expect(200)
            .then((res) => {
              expect(res.body.article).to.be.an('object');
              expect(res.body.article.author).to.equal('butter_bridge');
            });
        });
        it('GET status: 200, each single article has a comment count property', () => {
          return request
            .get('/api/articles/1')
            .expect(200)
            .then((res) => {
              expect(res.body.article).to.include.keys('comment_count');
              expect(res.body.article.comment_count).to.equal('13');
            });
        });
        it('PATCH status: 201, it responds with one article object based on article ID with modifications', () => {
          return request
            .patch('/api/articles/1')
            .send({ inc_votes: 1 })
            .expect(201)
            .then((res) => {
              expect(res.body.article.votes).to.equal(101);
            });
        });
        it('DELETE status: 204', () => {
          return request.delete('/api/articles/1').expect(204);
        });
        describe('/articles/:article_id/comments', () => {
          it('GET status: 200, it responds with an array of comments based on one article object', () => {
            return request
              .get('/api/articles/1/comments')
              .expect(200)
              .then((res) => {
                expect(res.body.comments).to.be.an('array');
                expect(res.body.comments[0]).to.contain.keys(
                  'comment_id',
                  'author',
                  'article_id',
                  'votes',
                  'created_at',
                  'body',
                );
              });
          });
          it('GET status: 200, user can sort the comments by a specific column, default is created_at', () => {
            return request
              .get('/api/articles/1/comments?sort_by=author')
              .expect(200)
              .then((res) => {
                expect(res.body.comments[0].author).to.equal('icellusedkars');
              });
          });
          it('GET status: 200, user can order comments by ascending or descending, default is desc', () => {
            return request
              .get('/api/articles/1/comments?order_by=desc')
              .expect(200)
              .then((res) => {
                expect(res.body.comments[0].author).to.equal('butter_bridge');
              });
          });
          it('POST status 201, responds with a comment object', () => {
            return request
              .post('/api/articles/1/comments')
              .send({
                username: 'butter_bridge',
                body: 'This is a cool comment',
              })
              .expect(201)
              .then((res) => {
                expect(res.body.comment).to.contain.keys(
                  'comment_id',
                  'author',
                  'article_id',
                  'votes',
                  'created_at',
                  'body',
                );
              });
          });
        });
      });
    });
    describe('/comments', () => {
      describe('/comments/:comment_id', () => {
        it('PATCH status: 201, it responds with one comment object based on comment ID with modifications', () => {
          return request
            .patch('/api/comments/1')
            .send({ inc_votes: 1 })
            .expect(201)
            .then((res) => {
              expect(res.body.comment.votes).to.equal(17);
            });
        });
        it('DELETE status: 204', () => {
          return request.delete('/api/comments/1').expect(204);
        });
      });
    });
    describe('/users', () => {
      describe('/api/users', () => {
        it('GET status: 200, responds with an array of user objects', () => {
          return request
            .get('/api/users')
            .expect(200)
            .then((res) => {
              expect(res.body.users).to.be.an('array');
              expect(res.body.users[0]).to.contain.keys(
                'username',
                'avatar_url',
                'name',
              );
            });
        });
      });
      describe('/users/:username', () => {
        it('GET status: 200, it responds with one user object based on username', () => {
          return request
            .get('/api/users/rogersop')
            .expect(200)
            .then((res) => {
              expect(res.body.user).to.contain.keys(
                'username',
                'avatar_url',
                'name',
              );
              expect(res.body.user.name).to.equal('paul');
            });
        });
      });
    });
  });
});
