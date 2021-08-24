import { Controller } from 'egg';


export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    const file = ctx.request.files[0]
    ctx.body = await ctx.service.upload.upload(file, ctx);
  }

  public async uploadByJson() {
    const {ctx} = this
    const file = ctx.request.body.file
    const content = ctx.request.body.content
    ctx.body = await ctx.service.upload.uploadContent(file, content, ctx)
  }

  public async uploadPage() {
    const {ctx} = this
    const name = ctx.params.name
    const content = ctx.request.body.content
    const file = name + '.json'
    ctx.body = await ctx.service.upload.uploadJson("/pages", file, content, ctx)
  }
}
