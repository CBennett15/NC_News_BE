const { convertDate, formatData } = require('../db/utils');
const { expect } = require('chai');

describe('convertDate', () => {
  it('it returns an instance of a Date Object', () => {
    expect(convertDate(1468087638932)).to.be.an.instanceOf(Date);
  });
});
describe('formatData', () => {
  it('it returns an empty array when passed an empty array', () => {
    const input = [];
    const func = convertDate();
    const actual = formatData(input, func);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it('returns an array with an object with the correct format for an input of an array with one object', () => {
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
    const func = convertDate();
    const actual = formatData(input, func);
    const expected = [];
    expect(actual).to.eql(expected);
  });
});
