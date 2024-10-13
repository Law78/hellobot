import { app } from '@azure/functions';
import { handler } from './handler';


app.http('slackevents', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'v1/slack',
    handler: handler
});