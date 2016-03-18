import koa from 'koa';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Router } from 'react-router';
import Title from 'react-document-title';
import fs from 'fs';

const html  = fs.readFileSync('./server/index.html', 'utf-8');
const style = fs.readFileSync('./server/style.css', 'utf-8');
const app   = koa();
const script = process.env.NODE_ENV === 'production' ?
  '/assets/client.js' :
  'http://localhost:'

// In production, static files are served by the reverse proxy instead because
// of performance and caching concerns :)
if (process.env.NODE_ENV !== 'production') {
  app.use(require('koa-static')('./public'));
}

app.use(function* (next) {
  const router = Router.create({
    routes, // TODO
    location: this.path,
  });

  const title = Title.rewind();

  router.run((Handler, props) => {
    const markup = renderToString(<Handler {...props} />);

    this.status = 200;
    this.body   = html
      .replace('<!-- title -->', title)
      .replace('/* style */', style)
      .replace('<!-- markup -->', markup)
      .replace('script://', script);
  });

  yield next;
});

export default app;
