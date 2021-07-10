const buffer = Buffer.from("我五九五五九五九五九", 'utf-8')
const b64content = buffer.toString("base64")
const content = Buffer.from(b64content, 'base64')
console.log(content.toString("utf-8"))