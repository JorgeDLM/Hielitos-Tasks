const { exec } = require('child_process')
require("dotenv").config()

const API_KEY = process.env.TYPESENSE_ADMIN_API_KEY
const PORT = 8180

const command = `docker run -d -p ${PORT}:8108 -v \`pwd\`/typesense-server-data/:/data \
typesense/typesense:0.22.0.rcu6 --data-dir /data --api-key=${API_KEY} --listen-port ${PORT} --enable-cors`

exec(command, (err, stdout, stderr) => {
    if(!err && !stderr){
        console.log( "Typesense Server corriendo...")
    }
    if(err) {
        console.log("Error en el servidor de Typesense: ", err)
    }
    if(stderr) {
        console.log("Error en el servidor de Typesense: ", stderr)
    }
    if(stdout) {
        console.log("Server output: ", stdout)
    }
})