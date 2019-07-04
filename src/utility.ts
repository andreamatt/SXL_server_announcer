const isInteger = Number.isInteger

function toInt(value: any) {
	if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
		return Number(value)
	return NaN
}

/**
 * Description: checks if passed value is a NON-EMPTY STRING
*/
function isString(value: any) {
	return (typeof value === 'string' || value instanceof String) && value.length > 0
}

function isBool(value: any) {
	return typeof value === "boolean"
}

function isNumber(value: any) {
	return typeof value === 'number' && isFinite(value)
}

function isStringDate(value: any) {
	return isString(value) && !isNaN(Date.parse(value))
}

function isArray(value: any) {
	if (value) {
		return typeof value === 'object' && value.constructor === Array && Array.isArray(value)
	}
	return false
}

function doOffset(collection: Array<any>, offset: number) {
	if (!isArray(collection) || !isInteger(offset) || offset < 0) {
		throw new Error("Bad doOffset parameters")
	}
	return collection.slice(offset)
}

function doLimit(collection: Array<any>, limit: number) {
	if (!isArray(collection) || !isInteger(limit) || limit < 0) {
		throw new Error("Bad doLimit parameters")
	}
	return collection.slice(0, limit)
}

function doOffsetLimit(collection: Array<any>, offset: number, limit: number) {
	if (!isArray(collection) || !isInteger(offset) || offset < 0 || !isInteger(limit) || limit < 0) {
		throw new Error("Bad doOffsetLimit parameters")
	}
	let withOffset = doOffset(collection, offset)
	return doLimit(withOffset, limit)
}

class MyRequest {
	params: object
	query: object
	body: object
	constructor() {
		this.params = {}
		this.query = {}
		this.body = {}
	}
}

class MyResponse {
	status: number
	text: string | null
	json: object | null
	constructor(status: number, result: string | object) {
		if (arguments.length > 2 || !isInteger(status) || status < 0 || result === undefined || result === null) {
			throw new Error("Wrong Response parameters")
		}
		this.status = status
		this.text = this.json = null
		if (isString(result)) {
			this.text = String(result)
		} else if (result === Object(result)) {
			this.json = Object(result)
		} else {
			throw new Error("Wrong response parameter")
		}
	}
}

export {
	toInt,
	isInteger,
	isString,
	isNumber,
	isStringDate,
	isArray,
	doOffset,
	doLimit,
	doOffsetLimit,
	MyRequest,
	MyResponse
}
