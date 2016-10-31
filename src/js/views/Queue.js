
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FontAwesome from 'react-fontawesome'
import TrackList from '../components/TrackList'
import Track from '../components/Track'
import Player from '../components/Player'
import ArtistSentence from '../components/ArtistSentence'
import AlbumLink from '../components/AlbumLink'
import Header from '../components/Header'

import * as mopidyActions from '../services/mopidy/actions'

class Queue extends React.Component{

	constructor(props) {
		super(props);
	}

	renderTrackInFocus(){
		if( this.props.mopidy && this.props.mopidy.trackInFocus ){
			return (
				<div>
					<div>{ this.props.mopidy.trackInFocus.track.name }</div>
					<div><ArtistSentence artists={ this.props.mopidy.trackInFocus.track.artists } /></div>
					<div><AlbumLink album={ this.props.mopidy.trackInFocus.track.album } /></div>
				</div>
			);
		}
		return null;
	}

	renderTrackList(){
		if( this.props.mopidy && this.props.mopidy.tracks ){
			return (
				<TrackList
					context="queue"
					tracks={this.props.mopidy.tracks} 
					removeTracks={ tracks => this.removeTracks( tracks ) }
					playTracks={ tracks => this.playTracks( tracks ) }
					playTrack={ track => this.playTrack( track ) }
					/>
			);
		}
		return null;
	}

	removeTracks( tracks ){
		var tlids = [];
		for( var i = 0; i < tracks.length; i++ ){
			tlids.push( tracks[i].tlid )
		}
		this.props.mopidyActions.removeTracks( tlids )
	}

	playTrack( track ){
		this.props.mopidyActions.changeTrack( track.tlid )
	}

	playTracks( tracks ){
		this.props.mopidyActions.changeTrack( tracks[0].tlid )
	}

	render(){
		return (
			<div className="view queue-view">
				<Header
					icon="play"
					title="Now playing"
					/>
				{ this.renderTrackInFocus() }
				{ this.renderTrackList() }
			</div>
		);
	}
}


/**
 * Export our component
 *
 * We also integrate our global store, using connect()
 **/

const mapStateToProps = (state, ownProps) => {
	return state;
}

const mapDispatchToProps = (dispatch) => {
	return {
		mopidyActions: bindActionCreators(mopidyActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Queue)