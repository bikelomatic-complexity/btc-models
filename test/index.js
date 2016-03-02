
/*global describe it*/

import { expect } from 'chai';

import * as index from '../lib/index';

describe( 'index.js', function() {
  it( 'should export User and UserCollection', function() {
    expect( index ).to.have.property( 'User' );
    expect( index ).to.have.property( 'UserCollection' );
  } );
  it( 'should export Login', function() {
    expect( index ).to.have.property( 'Login' );
  } );
} );
