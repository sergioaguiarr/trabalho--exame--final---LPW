const express = require("express")
const server = express()
server.use(express.json())

const professores = []

function verificarMatricula(request, response, next) {
  const matricula = request.params.matricula
  const professorExistente = professores.findIndex(professor => {
    return professor.matricula === matricula
  })
  if(professorExistente === -1) {
    return response.status(400).json({ error: " Não existe informação com este id ou matricula ou código." })
  }
  return next()
}

function verificarDados(request, response, next) {
  const { matricula, nome, sobrenome, aulas_dia } = request.body
  if(matricula === undefined || nome === undefined || sobrenome === undefined || aulas_dia === undefined) {
    return response.status(400).json({ error: "O campo matricula ou nome ou sobrenome ou aulas dia não existe no corpo da requisição"})
  }
  return next()
}

server.post("/professores", verificarDados, (request, response) => {
  const { matricula, nome, sobrenome, aulas_dia } = request.body
  professores.push({
    matricula,
    nome,
    sobrenome,
    aulas_dia,
  })

  return response.json({ matricula, nome, sobrenome, aulas_dia})
})

server.get("/professores", (request, response) => {
  return response.json(professores)
})


server.get("/professores/:matricula", verificarMatricula, (request, response) => {
  const matricula = request.params.matricula
  const professorEscolhido = professores.filter( professor => {
    return professor.matricula === matricula
  })

  return response.json(professorEscolhido)
})

server.put("/professores/:matricula", verificarDados, verificarMatricula, (request, response) => {
  const matricula = request.params.matricula
  const professorExistente = professores.findIndex(professor => {
    return professor.matricula === matricula
  })
  professores[professorExistente] = request.body;
  return response.json(professores[professorExistente])
})

server.delete("/professores/:matricula", verificarMatricula, (request, response) => {
  const matricula = request.params.matricula
  const professorExistente = professores.findIndex(professor => {
    return professor.matricula === matricula
  })
  professores.splice(professorExistente, 1)
  return response.json(professores[professorExistente])
})


server.listen(3333, () => {
  console.log("Servidor Rodando")
})