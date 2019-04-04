process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe('/', () => {
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
    it('GET status 404 for path that does not exist, responds with Route Not Found', () => {
      return request
        .get('/api/non-existent-route')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Route Not Found');
        });
    });
    describe('/topics', () => {
      it('GET status: 200, it responds with an array of topic objects each topic having the right properties', () => {
        return request
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an('array');
            expect(body.topics[0]).to.contain.keys('description', 'slug');
            expect(body.topics[0].slug).to.equal('mitch');
            expect(body.topics.length).to.equal(2);
          });
      });
      it('INVALID METHOD status: 405, responds with message Method Not Allowed', () => {
        return request
          .post('/api/topics')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method Not Allowed');
          });
      });
    });
    describe('/articles', () => {
      it('GET status: 200, it responds with an array of article objects, each topic having the right properties', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.an('array');
            expect(body.articles[0]).to.contain.keys(
              'article_id',
              'title',
              'body',
              'votes',
              'topic',
              'author',
              'created_at',
            );
            expect(body.articles[0].title).to.equal(
              'Living in the shadow of a great man',
            );
          });
      });
      it('GET status: 200, each article has a comment count property', () => {
        return request
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.include.keys('comment_count');
          });
      });
      it('GET status: 200, user can filter by author and return all articles associated with that username', () => {
        return request
          .get('/api/articles?author=butter_bridge')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).to.equal(3);
            expect(body.articles[0].author).to.equal('butter_bridge');
          });
      });
      it('GET status: 200, user can filter by topic and return all articles associated with that topic', () => {
        return request
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).to.equal(1);
            expect(body.articles[0].topic).to.equal('cats');
          });
      });
      it('GET status: 200, user can sort the articles by a specific column with default set to Date', () => {
        return request
          .get('/api/articles?sort_by=topic')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].topic).to.equal('mitch');
          });
      });
      it('GET status: 200, user can order results by ascending or descending, with defualt set to desc', () => {
        return request
          .get('/api/articles?order_by=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.equal('Moustache');
            expect(body.articles[body.articles.length - 1].title).to.equal(
              'Living in the shadow of a great man',
            );
          });
      });
      it('INVALID METHOD status: 405, responds with message Method Not Allowed', () => {
        return request
          .put('/api/articles')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method Not Allowed');
          });
      });
      it('BAD QUERIES status: 400, responds with message Bad Request when user sorts by non-existent column', () => {
        return request
          .get('/api/articles?sort_by=cats')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request');
          });
      });
      it('NOT FOUND status: 404, responds with message Not Found when user filters by non-existent author or topic', () => {
        return request
          .get('/api/articles?username=sam')
          .expect(404)
          .then(({ body }) => {
            console.log(body);
            expect(body.msg).to.equal('Route Not Found');
          });
      });
      it('GET status: 200, it responds with an empty array when user filters by author/topic that does exist but has no articles associated with it ', () => {
        return request
          .get('/api/articles?author=wulfwyn')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).to.equal(0);
          });
      });
      describe('/articles/:article_id', () => {
        it('GET status: 200, it responds with one article object based on article ID', () => {
          return request
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.be.an('object');
              expect(body.article.author).to.equal('butter_bridge');
            });
        });
        it('GET status: 200, each single article has a comment count property', () => {
          return request
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
              expect(body.article).to.include.keys('comment_count');
              expect(body.article.comment_count).to.equal('13');
            });
        });
        it('PATCH status: 200, it responds with one article object based on article ID with modifications', () => {
          return request
            .patch('/api/articles/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(101);
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
              .then(({ body }) => {
                expect(body.comments).to.be.an('array');
                expect(body.comments[0]).to.contain.keys(
                  'comment_id',
                  'author',
                  'article_id',
                  'votes',
                  'created_at',
                  'body',
                );
                expect(body.comments[0].author).to.equal('butter_bridge');
              });
          });
          it('GET status: 200, user can sort the comments by a specific column, default is created_at', () => {
            return request
              .get('/api/articles/1/comments?sort_by=author')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0].author).to.equal('icellusedkars');
                expect(body.comments.length).to.equal(13);
              });
          });
          it('GET status: 200, user can order comments by ascending or descending, default is desc', () => {
            return request
              .get('/api/articles/1/comments?order_by=desc')
              .expect(200)
              .then(({ body }) => {
                expect(body.comments[0].author).to.equal('butter_bridge');
                expect(body.comments[body.comments.length - 1].votes).to.equal(
                  16,
                );
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
              .then(({ body }) => {
                expect(body.comment).to.contain.keys(
                  'comment_id',
                  'author',
                  'article_id',
                  'votes',
                  'created_at',
                  'body',
                );
                expect(body.comment.author).to.equal('butter_bridge');
              });
          });
        });
      });
    });
    describe('/comments', () => {
      it('GET status 200, responds with an array of comment objects', () => {
        return request
          .get('/api/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.an('array');
            expect(body.comments[0]).to.contain.keys(
              'comment_id',
              'author',
              'article_id',
              'votes',
              'created_at',
              'body',
            );
            expect(body.comments[0].comment_id).to.equal(1);
          });
      });
      describe('/comments/:comment_id', () => {
        it('PATCH status: 200, it responds with one comment object based on comment ID with modifications', () => {
          return request
            .patch('/api/comments/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(17);
            });
        });
        it('DELETE status: 204', () => {
          return request.delete('/api/comments/1').expect(204);
        });
        it('INVALID METHOD status: 405, responds with message Method Not Allowed', () => {
          return request
            .put('/api/comments/1')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method Not Allowed');
            });
        });
      });
    });
    describe('/users', () => {
      describe('/api/users', () => {
        it('GET status: 200, responds with an array of user objects', () => {
          return request
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
              expect(body.users).to.be.an('array');
              expect(body.users[0]).to.contain.keys(
                'username',
                'avatar_url',
                'name',
              );
              expect(body.users[0].name).to.equal('jonny');
            });
        });
        it('INVALID METHOD status: 405, responds with message Method Not Allowed', () => {
          return request
            .put('/api/users')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method Not Allowed');
            });
        });
      });
      describe('/users/:username', () => {
        it('GET status: 200, it responds with one user object based on username', () => {
          return request
            .get('/api/users/rogersop')
            .expect(200)
            .then(({ body }) => {
              expect(body.user).to.contain.keys(
                'username',
                'avatar_url',
                'name',
              );
              expect(body.user.name).to.equal('paul');
            });
        });
      });
    });
  });
});
