import app from './lib/server'

const PORT = Number(process.env.PORT || 12345)

app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`)
})
