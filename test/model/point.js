/*global describe it beforeEach afterEach*/
import chai, { expect } from 'chai';
import promised from 'chai-as-promised';

chai.use( promised );

import PouchDB from 'pouchdb';
import { repeat } from 'lodash';

import { connect } from '../../src/connect';
import { Service, Alert, PointCollection, Comment, CommentCollection } from '../../src/model/point';

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
        const ConnectedService = connect( this.pouch, Service );

        const service = new ConnectedService( this.service.attributes );
        service.save();
        const doc = this.pouch.get( service.id );
        expect( doc ).to.eventually.have.property( 'type', 'restaurant' );
      } );
    } );
    describe( 'destroy()', function() {
      it( 'should delete the service from PouchDB', function( done ) {
        const ConnectedService = connect( this.pouch, Service );

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

  describe( 'Alert', function() {
    beforeEach( function() {
      this.alert = new Alert( {
        name: 'Flooding on I90',
        location: [ 0, 0 ],
        type: 'flooding',
        description: 'There\'s some flooding near Utica'
      } );
    } );
    afterEach( function() {
      this.alert.clear();
    } );
    describe( 'validate()', function() {
      it( 'should validate its attributes', function() {
        const errors = this.alert.validate( this.alert.attributes );
        expect( errors ).to.not.exist;
      } );
      it( 'should validate an alert type', function() {
        this.alert.set( 'type', 'grocery', val );
        expect( this.alert.validationError ).to.exist;

        this.alert.set( 'type', 'detour', val );
        expect( this.alert.validationError ).to.not.exist;
      } );
    } );
    describe( 'specify()', function() {
      it( 'should specify an id when name and locatoin are in args', function() {
        const alert = new Alert();
        alert.specify( 'Flooding on I90', [ 1, 1 ] );
        expect( alert.id ).to.exist.and.to.match( /alert\/flooding/ );
      } );
      it( 'should specify an id when name and location are in attributes', function() {
        const alert = new Alert( {
          name: 'Flooding on I90',
          location: [ 1, 1 ]
        } );
        alert.specify();
        expect( alert.id ).to.exist.and.to.match( /alert\/flooding/ );
      } );
    } );

  } );
  describe( 'PointCollection', function() {
    beforeEach( function() {
      this.points = new PointCollection( [ {
        _id: 'point/alert/flooding-on-i90/s00twy01m',
        name: 'Flooding on I90',
        location: [ 1, 1 ]
      }, {
        _id: 'point/service/joe-s-pizzeria/s00twy01m',
        name: 'Joe\'s Pizzeria',
        location: [ 1, 1 ]
      } ] );
    } );
    describe( 'model()', function() {
      it( 'should construct the right models', function() {
        expect( this.points.models[ 0 ] ).to.be.an.instanceof( Alert );
        expect( this.points.models[ 1 ] ).to.be.an.instanceof( Service );
      } );
    } );
    describe( 'fetch()', function( done ) {
      it( 'should fetch points from PouchDB', function( done ) {
        const ConnectedPointCollection = connect( this.pouch, PointCollection );
        const ConnectedService = connect( this.pouch, Service );

        const service = new ConnectedService( {
          name: 'Joe\'s Pizzeria',
          location: [ 0, 0 ],
          type: 'restaurant',
          amenities: [ 'restaurant' ],
          description: 'It is a restaurant'
        } );
        service.specify();

        service.save( {}, {
          success: ( ) => {
            const points = new ConnectedPointCollection();
            points.fetch( {
              success: collection => {
                expect( collection ).to.have.lengthOf( 1 );
                done();
              },
              error: err => done( err )
            } );
          },
          error: err => done( err )
        } );
      } );
    } );
    describe( 'create()', function() {
      it( 'should create and save points to PouchDB', function( done ) {
        const ConnectedPointCollection = connect( this.pouch, PointCollection );
        const points = new ConnectedPointCollection();
        points.once( 'add', ( ) => {
          points.reset();
          points.fetch( {
            success: points => {
              expect( points ).to.have.lengthOf( 1 );
              done();
            },
            error: err => done( err )
          } );
        } );
        points.create( {
          _id: 'point/service/joe-s-pizzeria/s00twy01m',
          name: 'Joe\'s Pizzeria',
          location: [ 0, 0 ],
          type: 'restaurant',
          amenities: [ 'restaurant' ],
          description: 'It is a restaurant'
        }, { wait: true } );
      } );
    } );
  } );

  describe( 'Comment', function() {
    beforeEach( function() {
      this.pointId = 'point/service/joe-s-pizzeria/s00twy01m';
      this.comment = new Comment( {
        username: 'joe',
        text: 'The pizza is pretty good',
        rating: 4
      }, {
        pointId: this.pointId
      } );
    } );
    describe( 'initialize()', function() {
      it( 'should create a new Comment with an id and uuid', function() {
        expect( this.comment.id ).to.match( new RegExp( this.pointId + '/comment' ) );
        expect( this.comment.get( 'uuid' ) ).to.exist;
      } );
    } );
    describe( 'validate()', function() {
      it( 'should validate it\'s attributes', function() {
        const errors = this.comment.validate( this.comment.attributes );
        expect( errors ).to.not.exist;
      } );
      it( 'should limit comments to 140 characters', function() {
        this.comment.set( 'text', repeat( 'a', 140 ), val );
        expect( this.comment.validationError ).to.not.exist;

        this.comment.set( 'text', repeat( 'a', 141 ), val );
        expect( this.comment.validationError ).to.exist;
      } );
    } );
    describe( 'save()', function() {
      it( 'should save to PouchDB', function() {
        const ConnectedComment = connect( this.pouch, Comment );
        const comment = new ConnectedComment( {
          username: 'joe',
          text: 'The pizza is pretty good',
          rating: 4
        }, {
          pointId: this.pointId
        } );
        comment.save();
        const doc = this.pouch.get( comment.id );
        expect( doc ).to.eventually.have.property( 'username', 'joe' );
      } );
    } );
  } );

  describe( 'CommentCollection', function() {
    beforeEach( function() {
      const pointId = this.pointId = 'point/service/joe-s-pizzeria/s00twy01m';
      this.comments = new CommentCollection( [], { pointId } );
    } );
    describe( 'initialize()', function() {
      it( 'should set pointId as an instance variable', function() {
        expect( this.comments ).to.have.property( 'pointId', this.pointId );
      } );
    } );
    describe( 'model()', function() {
      it( 'should return Comment models', function() {
        this.comments.add( {
          username: 'joe',
          text: 'The pizza is pretty good!',
          rating: 4
        } );
        expect( this.comments.models[ 0 ] ).to.be.an.instanceof( Comment )
          .and.to.have.deep.property( 'attributes.rating', 4 );
      } );
    } );
    describe( 'fetch()', function() {
      it( 'should fetch comments from PouchDB', function( done ) {
        const pointId = this.pointId;
        const CCommentCollection = connect( this.pouch, CommentCollection );

        const comments = new CCommentCollection( [], { pointId } );
        comments.create( {
          username: 'joe',
          text: 'joe comment',
          rating: 4
        } );
        comments.create( {
          username: 'bob',
          text: 'bob comment',
          rating: 4
        }, { wait: true } );

        comments.once( 'add', ( ) => {
          comments.reset();
          comments.fetch( {
            success: comments => {
              expect( comments.models ).to.have.lengthOf( 2 );
              done();
            },
            error: err => done( err )
          } );
        } );
      } );
    } );
  } );
} );
