import { Meteor } from 'meteor/meteor';
import { Links } from '../imports/collections/links';
import { WebApp } from 'meteor/webapp';
import ConnectRoute from 'connect-route';

Meteor.startup(() => {
    Meteor.publish('links', function(){
        return Links.find({});
    });
});

// Executed whenever a user visits a route like
// localhost:3000/abcd
function onRoute(req, res, next){
    // Take the token out and find the url
    const link = Links.findOne({token: req.params.token});
    // If we find a link object, redirect the user to the
    // long URL
    if(link){
        Links.update(link, {$inc: {clicks: 1}});
        res.writeHead(307, {'Location':link.url});
        res.end();
    }else{
        // If no match send the user to the normal React app
        next();
    }

}

const middleware = ConnectRoute((router) => {
   router.get('/:token', onRoute) ;
});

WebApp.connectHandlers
    .use(middleware);