const loginControl = (request, response) => {
    const clientServices = require('../services/clientServices');

    let username = request.body.username;
    let password = request.body.password;
    if (!username || !password) {
        response.render('loggedin', { human : "Login Failed" });;
    } else {
        if (request.session && request.session.user) {
            response.render('loggedin', { human : "Already logged in" });
        } else {
            clientServices.loginService(username, password, function(err, dberr, client) {
                console.log("Client from login service :" + JSON.stringify(client));
                if (client === null) {
                    console.log("Auhtentication problem!");
                    response.render('loggedin', { human : "Login Failed" });
                }else {
                    console.log("User from login service :" + client[0].num_client);
                    //add to session
                    request.session.user = username;
                    request.session.num_client = client[0].num_client;
                    request.session.admin = false;
                    response.render('loggedin', { human : "Congratulations you are logged in !" });
                }
            });
        }
    }
};


const registerControl = (request, response) => {
    const clientServices = require('../services/clientServices');
    const {Client} = require('../models/entities');

    let username = request.body.username;
    let password = request.body.password;
    let society = request.body.society;
    let contact = request.body.contact;
    let addres = request.body.addres;
    let zipcode = request.body.zipcode;
    let city = request.body.city;
    let phone = request.body.phone;
    let fax = request.body.fax;
    let max_outstanding = request.body.max_outstanding;
    let client = new Client(username, password, 0, society, contact, addres, zipcode, city, phone, fax, max_outstanding);

    clientServices.registerService(client, function(err, exists, insertedID) {
        console.log("User from register service :" + insertedID);
        if (exists) {
            console.log("Username taken!");
            response.render('registered', {registered : 'Registration failed. Username is already taken!'}); //invite to register
        } else {
            client.num_client = insertedID;
            console.log(`Registration (${username}, ${insertedID}) successful!`);
            response.render('registered', {registered : 'Successful registration!'});
        }
        response.end();
    });
};

const getClients = (request, response) => {
    const clientServices = require('../services/clientServices');
    clientServices.searchService(function(err, rows) {
        response.render('client', { clients: rows });
    });
};

const getClientByNumclient = (request, response) => {
    const clientServices = require('../services/clientServices');
    let num_client = request.params.num_client;
    let username;
    clientServices.searchUsernameService(num_client, function(err, row){
        username = row.username
        clientServices.searchNumclientService(num_client, function(err, rows) {
            console.log(rows);
            response.render('clientdetails', { clients: rows, name : username });
        });
    });
};


module.exports = {
    loginControl,
    registerControl,
    getClients,
    getClientByNumclient
};