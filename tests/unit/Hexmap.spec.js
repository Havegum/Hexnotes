import { assert } from 'chai';
// import { shallowMount } from '@vue/test-utils'
// import Hexmap from '@/scripts/hexmap.js'
import Hex from '@/scripts/hex.js';

describe('hex.js', () => {
  it('should generate a list of 6 points', () => {
    assert.equal(Hex.getCorners({ x: 0, y: 0 }, 1).length, 6);
  });
});
