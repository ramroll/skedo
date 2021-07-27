import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  // Pure 
  router.post('/by-object', controller.home.index);
  router.post('/by-content', controller.home.uploadByJson);
  // router.post('/page/:name', controller.home.uploadPage);
};
