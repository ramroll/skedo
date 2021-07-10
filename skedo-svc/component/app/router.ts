import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  
  router.put('/component/:group/:name', controller.doc.put);
  router.get('/component', controller.doc.get("component", ["group", "type"]));
  router.delete('/component/:group/:name', controller.doc.delete);
  router.put('/page/:name', controller.doc.put);
};
