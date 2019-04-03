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
        it('GET status: 200, it responds with an array of one article object based on article ID', () => {
          return request
            .get('/api/articles/1')
            .expect(200)
            .then((res) => {
              expect(res.body.articlebyID).to.be.an('array');
              expect(res.body.articlebyID[0].author).to.equal('butter_bridge');
            });
        });
        it('GET status: 200, each single article has a comment count property', () => {
          return request
            .get('/api/articles/1')
            .expect(200)
            .then((res) => {
              expect(res.body.articlebyID[0]).to.include.keys('comment_count');
              expect(res.body.articlebyID[0].comment_count).to.equal('13');
            });
        });
        it('PATCH status: 200, it responds with an array of one article object based on article ID with modifications', () => {
          return request.patch('/api/articles/1').expect(200);
        });
      });
    });
  });
});
