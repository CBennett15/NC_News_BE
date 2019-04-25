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
  it('GET status: 200', () => {
    return request
      .get('/')
      .expect(200)
      .then(({ body }) => {
        expect(body.ok).to.equal(true);
      });
  });
  describe('/api', () => {
    it('GET status:200', () => {
      return request
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).to.be.an('object');
        });
    });
    it('GET status: 404, responds with Route Note Found for path that does not exist', () => {
      return request
        .get('/api/non-existent-route')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal('Route Not Found');
        });
    });
    it('INVALID METHOD status: 405, responds with message Method Not Allowed when invalid http request', () => {
      return request
        .delete('/api')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal('Method Not Allowed');
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
          .delete('/api/topics')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method Not Allowed');
          });
      });
      it('POST status: 201, it responds with a new topic object ', () => {
        return request
          .post('/api/topics')
          .send({ slug: 'board_games', description: 'This is the life' })
          .expect(201)
          .then(({ body }) => {
            expect(body.topic.slug).to.equal('board_games');
          });
      });
      it('POST status: 422, topic to add already exists in the database', () => {
        return request
          .post('/api/topics')
          .send({ slug: 'cats' })
          .expect(422)
          .then(({ body }) => {
            expect(body.msg).to.equal('Unprocessable Entity - already exists');
          });
      });
      it('POST status: 400, topic does not include a slug', () => {
        return request
          .post('/api/topics')
          .send({ description: 'this is the life' })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('No Slug Included');
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
      it('GET status: 200, user can order results by ascending or descending, with default set to desc', () => {
        return request
          .get('/api/articles?order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0].title).to.equal('Moustache');
          });
      });
      it('GET status: 200, user can limit the number of responses on the page with default set to 10', () => {
        return request
          .get('/api/articles?limit=10')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).to.equal(10);
          });
      });
      xit('GET status: 200, repsonses can be filtered out by page', () => {
        return request
          .get('/api/articles?p=2')
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body.articles.length).to.equal(2);
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
      it('GET BAD QUERIES status: 400, responds with message Bad Request when user sorts by non-existent column', () => {
        return request
          .get('/api/articles?sort_by=cats')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request');
          });
      });
      it('GET NOT FOUND status: 404, responds with message Not Found when user filters by non-existent author', () => {
        return request
          .get('/api/articles?author=not-an-author')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Author Not Found');
          });
      });
      it('GET NOT FOUND status: 404, responds with message Not Found when user filters by non-existent topic', () => {
        return request
          .get('/api/articles?topic=not-a-topic')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Topic Not Found');
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

        it('PATCH status: 200, it responds with one article object based on article ID with votes incremented', () => {
          return request
            .patch('/api/articles/1')
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(110);
            });
        });
        it('PATCH staus: 200, it responds with one article object based on article ID with votes decremented', () => {
          return request
            .patch('/api/articles/1')
            .send({ inc_votes: -5 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(95);
            });
        });
        it('PATCH status: 200, it responds with original article object based on article ID without modification if no inc_votes on body', () => {
          return request
            .patch('/api/articles/1')
            .send({})
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(100);
            });
        });
        it('PATCH status: 400, it responds with Bad Request message when inc_votes has invalid input ', () => {
          return request
            .patch('/api/articles/1')
            .send({ inc_votes: 'cats' })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('Bad Request');
            });
        });
        it('PATCH status: 200, it responds with updated article object with updated votes even if other property on request body', () => {
          return request
            .patch('/api/articles/1')
            .send({ inc_votes: 5, name: 'Mitch' })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(105);
            });
        });
        it('DELETE status: 204', () => {
          return request.delete('/api/articles/1').expect(204);
        });
        it('DELETE status: 404, responds with a message of ID Not Found when input an id that is not there', () => {
          return request
            .delete('/api/articles/999')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('ID Not Found');
            });
        });
        it('GET BAD QUERIES status: 400, responds with message Bad Request when there is an incorrect format article ID', () => {
          return request
            .get('/api/articles/cats')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('Bad Request');
            });
        });
        it("GET NOT FOUND status: 404, responds with message Route Not Found when there a valid id but it doesn't exist", () => {
          return request
            .get('/api/articles/99999')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('Article Not Found');
            });
        });
        it('INVALID METHOD status: 405, responds with message Method Not Allowed when invalid http request', () => {
          return request
            .put('/api/articles/999')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method Not Allowed');
            });
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
              .get('/api/articles/1/comments?order=desc')
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
          it('POST status: 400, responds with a Bad Request when post request is empty object', () => {
            return request
              .post('/api/articles/1/comments')
              .send()
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal('Not included all required keys');
              });
          });
          it('POST status: 400, responds with a Bad Request when post request does not include all required keys', () => {
            return request
              .post('/api/articles/1/comments')
              .send({ username: 'wulfwyn' })
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).to.equal('Not included all required keys');
              });
          });
          it('INVALID METHOD status: 405, responds with message Method Not Allowed when invalid http request', () => {
            return request
              .put('/api/articles/1/comments')
              .expect(405)
              .then(({ body }) => {
                expect(body.msg).to.equal('Method Not Allowed');
              });
          });
          it("GET NOT FOUND status: 404, responds with message Not Found when there is a valid id but article doesn't exist", () => {
            return request
              .get('/api/articles/1000/comments')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).to.equal('Article Not Found');
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
      it('GET status: 200, user can filter by author and return all comments associated with that username', () => {
        return request
          .get('/api/comments?author=icellusedkars')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.equal(13);
            expect(body.comments[0].comment_id).to.equal(3);
          });
      });
      it('INVALID METHOD status: 405, responds with message Method Not Allowed when invalid http request', () => {
        return request
          .put('/api/comments')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method Not Allowed');
          });
      });
      describe('/comments/:comment_id', () => {
        it('PATCH status: 200, it responds with one comment object based on comment ID with votes incremented', () => {
          return request
            .patch('/api/comments/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(17);
            });
        });
        it('PATCH staus: 200, it responds with one comment object based on article ID with votes decremented', () => {
          return request
            .patch('/api/comments/1')
            .send({ inc_votes: -5 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(11);
            });
        });
        it('PATCH status: 200, it responds with original article object based on article ID without modification if no inc_votes on body', () => {
          return request
            .patch('/api/comments/1')
            .send({})
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(16);
            });
        });
        it('PATCH status: 400, it responds with Bad Request message when inc_votes has invalid input ', () => {
          return request
            .patch('/api/comments/1')
            .send({ inc_votes: 'cats' })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal('Bad Request');
            });
        });
        it('PATCH status: 200, it responds with updated comment object with updated votes even if other property on request body', () => {
          return request
            .patch('/api/comments/1')
            .send({ inc_votes: 5, name: 'Mitch' })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(21);
            });
        });
        it("PATCH status: 404, responds with message Not Found when there is a valid id but comment doesn't exist", () => {
          return request
            .patch('/api/comments/1000')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('Comment Not Found');
            });
        });
        it('DELETE status: 204', () => {
          return request.delete('/api/comments/1').expect(204);
        });
        it('DELETE status: 404, responds with a message of ID Not Found when input an id that is not there', () => {
          return request
            .delete('/api/comments/999')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('ID Not Found');
            });
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
        it('POST status: 201, it responds with a new user object', () => {
          return request
            .post('/api/users')
            .send({
              username: 'swordnut',
              name: 'paul',
              avatar_url:
                'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.user.name).to.equal('paul');
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
        it('GET NOT FOUND status: 404, responds with error message for username not found in database', () => {
          return request
            .get('/api/users/rollypolly')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal('User Not Found');
            });
        });
        it('INVALID METHOD status: 405, responds with message Method Not Allowed when invalid http request', () => {
          return request
            .put('/api/users/jerry')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method Not Allowed');
            });
        });
      });
    });
  });
});
