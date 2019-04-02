const { convertDate, createRef } = require('../db/utils');
const { expect } = require('chai');

describe('convertDate', () => {
  it('it returns an empty array when input is an empty array', () => {
    const input = [];
    const actual = convertDate(input);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it('it returns an instance of a Date Object', () => {
    const input = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100,
      },
    ];
    const actual = convertDate(input);
    expect(actual[0].created_at).to.be.an.instanceOf(Date);
  });
});
describe('createRef', () => {
  it('it returns an empty object, when passed an empty array', () => {
    const input = [];
    const actual = createRef(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it('it returns an object with one key value pair when passed an array with one object', () => {
    const input = [
      { article_id: 1, title: 'Living in the shadow of a great man' },
    ];
    const actual = createRef(input);
    const expected = { 'Living in the shadow of a great man': 1 };
    expect(actual).to.eql(expected);
  });
  it('it returns an object with multiple key value pairs when passed an array of objects', () => {
    const input = [
      { article_id: 1, title: 'Living in the shadow of a great man' },
      { article_id: 2, title: 'Sony Vaio; or, The Laptop' },
    ];
    const actual = createRef(input);
    const expected = {
      'Living in the shadow of a great man': 1,
      'Sony Vaio; or, The Laptop': 2,
    };
    expect(actual).to.eql(expected);
  });
  it('it will return an object with key value pairs based on what arguments are passed', () => {
    const input = [
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        article_id: 1,
      },
    ];
    const actual = createRef(input, 'author', 'article_id');
    const expected = { icellusedkars: 1 };
    expect(actual).to.eql(expected);
  });
});
