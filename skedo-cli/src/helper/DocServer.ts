import MarkdownIt from 'markdown-it'
import {parse} from 'node-html-parser'
import fs from 'fs'
import path from 'path'
import UI from './UI'
import express, {Express} from 'express'

const md = new MarkdownIt()

type ImgDescriptor = {
	key : string,
	localFile : string
}

class MDDescriptor {

	raw : string
	html : string
	title : string
	key : string
	no? : string
	order? : number
	localImags : Array<ImgDescriptor> 
	
	constructor(file : string, dir : string) {
		this.localImags = []
		const fileName = file.split(/(\/|\\)/).pop()
		if(!fileName) {
			throw new Error("file name error.")
		}
		this.key = fileName.replace('.md', '')
		this.key = this.key.replace(' ', '_')
		const mNo = this.key.match(/^[\d-]+/)
		if(mNo) {
			this.no = mNo[0]
			const [a, b] = this.no.split(/\.|-/).map(x => parseInt(x) || 0)
			this.order = ( (a || 0) * 10000) + (b || 0) 
			this.key = this.key.trim()
		}
		const content = fs.readFileSync(file, 'utf-8')
		this.raw = content
		this.html = md.render(this.raw)
		const root = parse(this.html)

		const h1 = root.querySelector('h1')
		const h2 = root.querySelector('h2')

		this.title = (h1 || h2 ) ? (h1 || h2).innerText : ''

		const imgs = root.querySelectorAll('img')
			.forEach(img => {
				const src = img.getAttribute('src')
				if(!src) {
					return
				}
				if(src?.match(/^(http|\/)/)) {
					return
				}
				const imgPath = decodeURIComponent(src)
				const imgKey = "/" + src.split(/(\/|\\)/).pop()
				img.setAttribute('src',imgKey)
				this.localImags.push({
					key : imgKey,
					localFile : path.resolve(dir, imgPath)
					
				})
			})

		// 计算menu
		this.html = root.innerHTML

		// this.html = template.replace("{content}", root.innerHTML)
	}
}


export default class DocServer {
	ui :UI 
	app : Express
	constructor(dir :string) {
		this.ui = UI.getUI()
		if(!fs.existsSync(dir)) {
			throw new Error("Directory " + dir + " not exists.")	
		}


		const mds = fs.readdirSync(dir)
			.filter(x => x.match(/\.md$/))
			.map(x => new MDDescriptor(path.resolve(dir, x), dir))
		
		this.app = express()

		let menu = mds.map(md => {
			return `<li><a href='${'/' + md.key}'>${md.title}</a></li>`
		}).join("")

		menu = `<ul>${menu}</ul>`



		mds.forEach(md => {
			this.app.get('/' + md.key, (req, res) => {
				let html = fs.readFileSync(path.resolve(__dirname, "../res/md.html"), 'utf-8')
				html = html.replace("{content}", md.html)
				html = html.replace("{menu}", menu)

				res.send(html)
			})

			for(let img of md.localImags) {
				this.app.get(img.key, (req, res) => {
					console.log(img.localFile)
					res.sendFile(img.localFile)
				})
			}
		})

	}

	start(){
		this.app.listen(3210, () => {
			this.ui.success("listen at 3210.")
		})
	}

}
