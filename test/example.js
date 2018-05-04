/**
 * This file serves as an example for how APITool can be used. Please read the documentation in the APITool class for
 * more information.
 */

// Require the API Tool base.
const APITool = require('../lib/api-tool');

// Extend the API Tool class with the methods for your API. All request methods return a Promise.
class HackableAppAPI extends APITool {
    static get Status() {
        return {
            Available: 0,
            Unavailable: 1
        }
    }

    createUser(username, password, email) {
        return this.doPost(this.endpoints.user, APITool.Auth.Token, {
            body: { username, password, email }
        })
    }

    deleteUser(id) {
        return this.doDelete(`${this.endpoints.user}/${id}`, APITool.Auth.Token);
    }

    getStatus() {
        return this.doGet(this.endpoints.status, APITool.Auth.None);
    }
}

// Create a new instance of your API class. Load config from a file or write it into the code.
const api = new HackableAppAPI({
    host: 'https://api.hackableapp.com:3000',
    username: 'developer',
    password: 'sup3Rs3cr3t!!',
    proxy: 'http://localhost:8080',
    endpoints: {
        token: '/auth',
        user: '/user',
        status: '/status'
    }
});

// Create several test functions. This one makes sure the API is available, then creates and deletes a user.
async function createAndDeleteUser() {
    const USERNAME = 'hacker', PASSWORD = 'letmein', EMAIL = 'hacker@raxis.com';

    if(await api.getStatus() === HackableAppAPI.Status.Unavailable)
        throw 'The API is currently inaccessible.';

    const user = await api.createUser(USERNAME, PASSWORD, EMAIL);
    return await api.deleteUser(user.id);
}

// Run the test functions and log the results.
createAndDeleteUser().then(console.log).catch(console.error);