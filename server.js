const app = require("./src/app");

const PORT = process.env.PRO_APP_PORT || process.env.DEV_APP_PORT

const server = app.listen( PORT, () => {
  console.log(`WSV eCommerce start with ${PORT}`)
})

// process.on( 'SIGINT', () => {
//   server.close(() => console.log(`Exit Sever Express`))
// })
