'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;
var favicon = require('serve-favicon'),
    express = require('express');
var Console = new Module('console');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Console.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Console.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Console.menus.add({
    title: 'console example page',
    link: 'console example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Console.aggregateAsset('css', 'console.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Console.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Console.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Console.settings(function(err, settings) {
        //you now have the settings object
    });
    */
//  app.set('views', __dirname + '/server/views');

    // Setting the favicon and static folder
    app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));

    // Adding robots and humans txt
//    app.use(express.static(__dirname + '/public/assets/static'));
  return Console;
});
