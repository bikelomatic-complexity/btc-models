/*global describe it beforeEach afterEach*/
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';

chai.use( promised );

import PouchDB from 'pouchdb';

import { connect } from '../../src/connect';
import { Service } from '../../src/model/point';

const val = { validate: true };

describe( 'Point models and collections', function() {
  beforeEach( function() {
    this.pouch = new PouchDB( 'points' );
  } );
  afterEach( function( done ) {
    this.pouch.destroy().then( res => done(), err => done( err ) );
  } );
  describe( 'Service', function() {
    beforeEach( function() {
      this.service = new Service( {
        name: 'Joe\'s Pizzeria',
        location: [ 0, 0 ],
        type: 'restaurant',
        amenities: [ 'restaurant' ],
        description: 'It is a restaurant'
      } );
    } );
    afterEach( function() {
      this.service.clear();
    } );
    describe( 'validate()', function() {
      it( 'should validate its attributes', function() {
        const errors = this.service.validate( this.service.attributes );
        expect( errors ).to.not.exist;
      } );
      it( 'should validate the location array', function() {
        this.service.set( 'location', [ 1, 1 ], val );
        expect( this.service.validationError ).to.not.exist;

        this.service.set( 'location', [ 1.0, 1.0 ], val );
        expect( this.service.validationError ).to.not.exist;

        this.service.set( 'location', [], val );
        expect( this.service.validationError ).to.exist;

        this.service.set( 'location', [ 1 ], val );
        expect( this.service.validationError ).to.exist;

        this.service.set( 'location', 1, val );
        expect( this.service.validationError ).to.exist;
      } );
      it( 'should validate a service type', function() {
        this.service.set( 'type', 'grocery', val );
        expect( this.service.validationError ).to.not.exist;

        this.service.set( 'type', 'flooding', val );
        expect( this.service.validationError ).to.exist;
      } );
    } );
    describe( 'initialize()', function() {
      it( 'should set created_at automatically', function() {
        expect( this.service.get( 'created_at' ) ).to.exist
          .and.to.be.at.most( new Date().toISOString() );
      } );
    } );
    describe( 'specify()', function() {
      it( 'should specify an id when name and locatoin are in args', function() {
        const service = new Service();
        service.specify( 'Joe\'s Pizzeria', [ 1, 1 ] );
        expect( service.id ).to.exist.and.to.match( /service\/joe/ );
      } );
      it( 'should specify an id when name and location are in attributes', function() {
        const service = new Service( {
          name: 'Joe\'s Pizzeria',
          location: [ 1, 1 ]
        } );
        service.specify();
        expect( service.id ).to.exist.and.to.match( /service\/joe/ );
      } );
    } );
    describe( 'save()', function() {
      it( 'should save to PouchDB', function() {
        const ConnectedService = Service.extend();
        connect( this.pouch, ConnectedService );

        const service = new ConnectedService( this.service.attributes );
        service.save();
        const doc = this.pouch.get( service.id );
        expect( doc ).to.eventually.have.property( 'type', 'restaurant' );
      } );
    } );
    describe( 'destroy()', function() {
      it( 'should delete the service from PouchDB', function( done ) {
        const ConnectedService = Service.extend();
        connect( this.pouch, ConnectedService );

        const service = new ConnectedService( this.service.attributes );

        const id = service.id;
        const testDestroy = ( ) => {
          service.destroy();
          const doc = this.pouch.get( id );
          expect( doc ).to.be.rejected.and.notify( done );
        };
        service.save( {}, { success: testDestroy, error: testDestroy } );
      } );
    } );
  } );
} );
