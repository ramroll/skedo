import express, {Express, Response} from 'express'
import { DocService } from './service/doc';
import chalk from 'chalk'
import cors from 'cors'
export default function routers(app : Express) {

  app.use(express.json())
  app.use(cors())
  function ssi<R>(serviceCall : Function, res : Response) : Promise<R>;
  function ssi<T, R>(serviceCall : Function, res : Response, arg1 : T) : Promise<R>;
  async function ssi(
    serviceCall: Function,
    res: Response,
    ...args  : Array<any>
  ) {
    try {
      const result = await serviceCall(...args)
      res.send({
        success: true,
        data: result,
      })
    } catch (ex) {
      console.error(chalk.red(ex))
      console.error(chalk.red(ex.stack))
      res.status(500).send({
        success: false,
        httpCode: 500,
        message: ex.toString(),
      })
    }
  }
	app.put('/component/:user/:group/:name', (req, res) => {
    const docSvc = new DocService("component", req.params)
    ssi(docSvc.put.bind(docSvc), res, req.body)
  });

  app.get('/component', (req, res) => {
    const docSvc = new DocService("component")
    ssi(docSvc.get.bind(docSvc), res)
  });

  app.delete('/component/:user/:group/:name', (req, res) => {
    const docSvc = new DocService("component", req.params)
    ssi(docSvc.get.bind(docSvc), res)
  });

  app.put('/page/:user/:name', (req, res) => {
    const docSvc = new DocService("page", req.params)
    ssi(docSvc.put.bind(docSvc), res, req.body)
  });

  app.get('/page/:user/:name', (req, res) => {
    const docSvc = new DocService("page", req.params)
    ssi(docSvc.get.bind(docSvc), res)
  });

  app.put('/code-project/:user/:name', (req, res) => {
    const docSvc = new DocService('code-project', req.params)
    ssi(docSvc.put.bind(docSvc), res, req.body)
  })

  app.get('/code-project/:user/:name', (req, res) => {
    const docSvc = new DocService('code-project', req.params)
    ssi(docSvc.get.bind(docSvc), res, req.body)
  })


}