
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { bindActionCreators } from 'redux'

import Header from '../components/Header'
import Thumbnail from '../components/Thumbnail'
import Icon from '../components/Icon'
import Link from '../components/Link';

import * as uiActions from '../services/ui/actions'
import * as pusherActions from '../services/pusher/actions'
import * as mopidyActions from '../services/mopidy/actions'
import * as spotifyActions from '../services/spotify/actions'

class Debug extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			mopidy_call: 'playlists.asList',
			mopidy_data: '{}',
			pusher_data: '{"method":"get_config"}',
			access_token: this.props.access_token,
			toggling_test_mode: false
		}
	}

	componentDidMount(){
		this.props.uiActions.setWindowTitle("Debug");
	}

	callMopidy(e){
		e.preventDefault()
		this.props.mopidyActions.debug(this.state.mopidy_call, JSON.parse(this.state.mopidy_data) )
	}

	callPusher(e){
		e.preventDefault()
		this.props.pusherActions.debug(JSON.parse(this.state.pusher_data) )
	}

	toggleTestMode(e){
		this.setState({toggling_test_mode: true});
		this.props.uiActions.set({ test_mode: !this.props.test_mode });

		// Wait a second to allow state to update, and then refresh
		setTimeout(location.reload(), 1000);
	}

	render(){

		var options = (
			<a className="button no-hover" onClick={e => hashHistory.push(global.baseURL+'settings')}>
				<Icon name="keyboard_backspace" />Back
			</a>
		)

		return (
			<div className="view debugger-view">
				<Header options={options} uiActions={this.props.uiActions}>
					<Icon name="settings" type="material" />
					Debug
				</Header>

				<div className="content-wrapper">

					<h4 className="underline">User interface</h4>
					<form>
						<div className="field checkbox">
							<div className="name">Test mode</div>
							<div className="input">
								{this.state.toggling_test_mode ? <span className="button working">Applying...</span> : (this.props.test_mode ? <span className="button destructive" onClick={e => this.toggleTestMode(e)}>Disable</span> : <span className="button primary" onClick={e => this.toggleTestMode(e)}>Enable</span>)}
							</div>
						</div>
						<div className="field checkbox">
							<div className="name">Debug</div>
							<div className="input">
								<label>
									<input 
										type="checkbox"
										name="debug_info"
										checked={ this.props.debug_info }
										onChange={ e => this.props.uiActions.set({ debug_info: !this.props.debug_info })} />
									<span className="label">Show debug overlay</span>
								</label>
							</div>
						</div>
						<div className="field checkbox">
							<div className="name">Logging</div>
							<div className="input">
								<label>
									<input 
										type="checkbox"
										name="log_actions"
										checked={ this.props.log_actions }
										onChange={ e => this.props.uiActions.set({ log_actions: !this.props.log_actions })} />
									<span className="label">Log actions</span>
								</label>
								<label>
									<input 
										type="checkbox"
										name="log_mopidy"
										checked={ this.props.log_mopidy }
										onChange={ e => this.props.uiActions.set({ log_mopidy: !this.props.log_mopidy })} />
									<span className="label">Log Mopidy</span>
								</label>
								<label>
									<input 
										type="checkbox"
										name="log_pusher"
										checked={ this.props.log_pusher }
										onChange={ e => this.props.uiActions.set({ log_pusher: !this.props.log_pusher })} />
									<span className="label">Log Pusher</span>
								</label>
							</div>
						</div>
						<div className="field">
							<div className="name"></div>
							<div className="input">
								<a className="button secondary" onClick={e => this.props.uiActions.createNotification({content: 'Test notification'})}>Create notification</a>
								<a className="button secondary" onClick={e => this.props.pusherActions.request('test')}>Run test process</a>
							</div>
						</div>
					</form>

					<h4 className="underline">Spotify</h4>
					<div className="field">
						<div className="name">Access token</div>
						<div className="input">
							<input
								type="text"
								onChange={e => this.props.spotifyActions.authorizationGranted({access_token: e.target.value})}
								value={this.state.access_token} />
						</div>
					</div>

					<h4 className="underline">Mopidy</h4>
					<form onSubmit={(e) => this.callMopidy(e)}>
						<div className="field">
							<div className="name">Call</div>
							<div className="input">
								<input 
									type="text"
									onChange={ e => this.setState({ mopidy_call: e.target.value })} 
									value={ this.state.mopidy_call } />
							</div>
						</div>
						<div className="field">
							<div className="name">Data</div>
							<div className="input">
								<textarea 
									onChange={ e => this.setState({ mopidy_data: e.target.value })}
									value={ this.state.mopidy_data }>
								</textarea>
							</div>
						</div>
						<div className="field">
							<div className="name"></div>
							<div className="input">
								<button type="submit" className="secondary">Send</button>
							</div>
						</div>
					</form>

					<h4 className="underline">Pusher</h4>
					<form onSubmit={(e) => this.callPusher(e)}>
						<div className="field">
							<div className="name">Examples</div>
							<div className="input">
								<select onChange={ e => this.setState({ pusher_data: e.target.value })}>
									<option value='{"method":"get_config"}'>Get config</option>
									<option value='{"method":"get_version"}'>Get version</option>
									<option value='{"method":"get_connections"}'>Get connections</option>
									<option value='{"method":"get_radio"}'>Get radio</option>
									<option value='{"method":"get_queue_metadata"}'>Get queue metadata</option>
									<option value='{"method":"broadcast","data":{"method":"notification","params":{"notification":{"type":"info","title":"Testing","content":"This is my message"}}}}'>Broadcast to all clients</option>
									<option value='{"method":"send_message","data":{"method":"notification","params":{"notification":{"type":"info","title":"Testing","content":"This is my message"}}}}'>Broadcast to one client</option>
									<option value='{"method":"set_username","data":{"connection_id":"CONNECTION_ID_HERE","username":"NewUsername"}}'>Change username</option>
									<option value='{"method":"refresh_spotify_token"}'>Refresh Spotify token</option>
									<option value='{"method":"broadcast","data":{"method":"reload","params":{}}}'>Forced reload for all connected clients</option>
									<option value='{"method":"perform_upgrade"}'>Perform upgrade (beta)</option>
								</select>
							</div>
						</div>
						<div className="field">
							<div className="name">Data</div>
							<div className="input">
								<textarea 
									onChange={ e => this.setState({ pusher_data: e.target.value })}
									value={ this.state.pusher_data }>
								</textarea>
							</div>
						</div>
						<div className="field">
							<div className="name"></div>
							<div className="input">
								<button type="submit" className="secondary">Send</button>
							</div>
						</div>
					</form>

					<h4 className="underline">Response</h4>
					<pre>
						{ this.props.debug_response ? JSON.stringify(this.props.debug_response, null, 2) : null }
					</pre>
					
		        </div>
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
	return {
		connection_id: state.pusher.connection_id,
		access_token: (state.spotify.access_token ? state.spotify.access_token : ''),
		log_actions: (state.ui.log_actions ? state.ui.log_actions : false),
		log_pusher: (state.ui.log_pusher ? state.ui.log_pusher : false),
		log_mopidy: (state.ui.log_mopidy ? state.ui.log_mopidy : false),
		test_mode: (state.ui.test_mode ? state.ui.test_mode : false),
		debug_info: (state.ui.debug_info ? state.ui.debug_info : false),
		debug_response: state.ui.debug_response
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		uiActions: bindActionCreators(uiActions, dispatch),
		pusherActions: bindActionCreators(pusherActions, dispatch),
		mopidyActions: bindActionCreators(mopidyActions, dispatch),
		spotifyActions: bindActionCreators(spotifyActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Debug)