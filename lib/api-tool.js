/**
 * This code is not supported by Raxis, Inc. It is available for your use, but will require some tweaking to work with
 * your specific application.
 *
 * @author Raxis, Inc.
 * @version 1.1
 */

const Request = require('request-promise-native');
const Path = require('path');

/**
 * A configuration object.
 * @typedef {object} APITool~Config
 * @property {string} host - The URL of the API (including the protocol).
 * @property {string} username - The username to use with the Basic authentication request.
 * @property {string} password - The password to use with the Basic authentication request.
 * @property {string} [proxy] - The URL of the proxy to use for an assessment tool like Burp Suite.
 * @property {object} endpoints - The API endpoints needed for use with this tool.
 * @property {string} endpoints.token - The authentication endpoint of the API from which to retrieve a token.
 */

/**
 * The default configuration file.
 * @type APITool~Config
 */
const DEFAULT_CONFIG = require('../config/default.json');

/**
 * Manages authentication and requests for the API. Extend this class to add API-specific REST methods.
 */
class APITool {
    /**
     * Enum for authentication.
     * @readonly
     * @enum {number}
     */
    static get Auth() {
        return {
            /** Use Basic username and password credentials. */
            Basic: 0,
            /** Use an authentication token. */
            Token: 1,
            /** Do not use authentication. */
            None: 2
        }
    }

    /**
     * Create a new API Tool.
     * @constructor
     * @param [config] {APITool~Config} - The configuration to use for the API tool.
     */
    constructor(config = DEFAULT_CONFIG) {
        this.host = config.host;
        this.username = config.username;
        this.password = config.password;
        this.proxy = config.proxy;
        this.endpoints = config.endpoints;
    }

    /**
     * Get the Basic authorization header from the provided username and password.
     * @return {string} - The Basic authorization header.
     */
    get basicAuthorization() {
        return 'Basic ' + Buffer.from(`${this.username}:${this.password}`).toString('base64');
    }

    /**
     * Get the Authorization header for the specified authentication type.
     * @async
     * @param authType {Auth} - The type of authentication that should be performed.
     * @return {Promise.<string|null>}
     */
    async getAuthorizationHeader (authType) {
        switch(authType) {
            case APITool.Auth.Basic: return this.basicAuthorization;
            case APITool.Auth.Token: return await this.getToken();
            case APITool.Auth.None: return null;
            default: return null;
        }
    }

    /**
     * Make a request to the API.
     * @async
     * @mixin
     * @param method {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} - The HTTP method to use for the request.
     * @param endpoint {string} - The endpoint to request.
     * @param [authType] {Auth} - The authentication type to use against the endpoint.
     * @param [options] {object} - An object containing additional data to pass in the request.
     * @return {Promise.<*>} - The JSON response from the API, or an error if one occurred.
     */
    async request (method = 'GET', endpoint, authType = APITool.Auth.Token, options = {}) {
        options.method = method;
        options.url = Path.join(this.host, endpoint);
        options.json = true;

        if(!options.headers) options.headers = {};
        options.headers.Accept = 'application/json';
        options.headers.Authorization = await this.getAuthorizationHeader(authType);

        if(this.proxy) {
            options.proxy = this.proxy;
            options.strictSSL = false;
        }

        return await Request(options);
    };

    /**
     * Make a GET request to the API.
     * @mixes request
     * @param endpoint {string} - The endpoint to request.
     * @param [authType = Auth.Token] {Auth} - The authentication type to use against the endpoint.
     * @param [options] {object} - An object containing additional data to pass in the request.
     * @return {Promise.<*>} - The JSON response from the API, or an error if one occurred.
     * @see request
     */
    doGet(endpoint, authType, options) { return this.request('GET', endpoint, authType, options) }

    /**
     * Make a POST request to the API.
     * @mixes request
     * @param endpoint {string} - The endpoint to request.
     * @param [authType = Auth.Token] {Auth} - The authentication type to use against the endpoint.
     * @param [options] {object} - An object containing additional data to pass in the request.
     * @return {Promise.<*>} - The JSON response from the API, or an error if one occurred.
     * @see request
     */
    doPost(endpoint, authType, options) { return this.request('POST', endpoint, authType, options) }

    /**
     * Make a PUT request to the API.
     * @mixes request
     * @param endpoint {string} - The endpoint to request.
     * @param [authType = Auth.Token] {Auth} - The authentication type to use against the endpoint.
     * @param [options] {object} - An object containing additional data to pass in the request.
     * @return {Promise.<*>} - The JSON response from the API, or an error if one occurred.
     * @see request
     */
    doPut(endpoint, authType, options) { return this.request('PUT', endpoint, authType, options) }

    /**
     * Make a PATCH request to the API.
     * @mixes request
     * @param endpoint {string} - The endpoint to request.
     * @param [authType = Auth.Token] {Auth} - The authentication type to use against the endpoint.
     * @param [options] {object} - An object containing additional data to pass in the request.
     * @return {Promise.<*>} - The JSON response from the API, or an error if one occurred.
     * @see request
     */
    doPatch(endpoint, authType, options) { return this.request('PATCH', endpoint, authType, options) }

    /**
     * Make a DELETE request to the API.
     * @mixes request
     * @param endpoint {string} - The endpoint to request.
     * @param [authType = Auth.Token] {Auth} - The authentication type to use against the endpoint.
     * @param [options] {object} - An object containing additional data to pass in the request.
     * @return {Promise.<*>} - The JSON response from the API, or an error if one occurred.
     * @see request
     */
    doDelete(endpoint, authType, options) { return this.request('DELETE', endpoint, authType, options) }

    /**
     * Get the API token for authenticated requests.
     * @return {Promise.<string>} - The API token, or an error if one occurred.
     */
    async getToken() {
        if(this._token) return this._token;
        const response = await this.doPost(this.endpoints.token, APITool.Auth.Basic);

        // This needs to be adjusted to the specific API implementation.
        this._token = response.token;
        return this._token;
    };
}

module.exports = APITool;