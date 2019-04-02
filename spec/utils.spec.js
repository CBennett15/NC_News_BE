const { convertDate, formatData } = require('../db/utils');
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
