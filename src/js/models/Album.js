
export class Album {

	constructor(props){
		for (var prop_name in props){
			if (props.hasOwnProperty(prop_name)){
				this[prop_name] = props[prop_name];
			}
		}
	}
}