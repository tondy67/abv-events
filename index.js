/** 
 * Abvos PatternEmitter
 * This class extends EventEmitter with pattern matching
 */
"use strict";

const EventEmitter = require('events');

class PatternEmitter extends EventEmitter
{
	constructor()
	{
		super();
		this._regexes = new Map();
	}
	
	match(event, listener)
	{
		if (!(event instanceof RegExp)){
			event = String(event);
			const a = event.split('/');
			const f = a.pop();
			const flags = ['g','i','m','u','y'];
			if (flags.includes(f)){
				event = new RegExp(a.join('/'),f);
			}else{
				a.push(f);
				event = new RegExp(a.join('/'));
			}
		} 
		const ev = 'rgx:' + event.toString();
		this._regexes.set(ev, event); 
		super.on(ev, listener);
		return this;
	}
	
	emit(event, ...args)
	{
		const events = this.eventNames();
		if (events.includes(event)) return super.emit(event, ...args);
		let match;
		for (let [k,v] of this._regexes){
			if (!(v instanceof RegExp)) continue;
			match = v.exec(event);
			if (match !== null){
				return super.emit(k, match, ...args);
			}
		}
	}
	
}

module.exports = PatternEmitter;
