// console.log("Hello, world!")
import express, { Request, Response } from "express";
import cors from "cors";
import { psychologists } from "./data";
import { users } from "./data";
import { user } from "./types";
import { psychologist } from "./types";

const app = express();
app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor pronto!");
});

const jwt = require("jsonwebtoken");
const SECRET = "testeDaAplicacao";

// A validação da autenticação não funciona

// function verifyJWT(req: Request, res: Response) {
//   const token = req.headers["authorization"];
//   jwt.verify(token, SECRET, (err: any, decoded: any) => {
//     if (err) return res.status(401).end();
//     req.userId = decoded.userId
//   });
// }

// ENDPOINT 1 - SIGNUP - CADASTRO DE USUÁRIO
app.post("/cadastro", (req: Request, res: Response) => {
  try {
    let userId: number = users.length + 1;

    let newUser: user = {
      id: userId,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    if (req.body.name && req.body.email && req.body.password) {
      users.push(newUser);
      const token = jwt.sign({ userId }, SECRET, { expiresIn: 300 });
      console.log("Novo usuário criado");
      return res.json({ auth: true, token });
    }

    res.status(401).end();
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500).end();
    } else {
      res.end();
    }
  }
});

// ENDPOINT 2 - LOGIN - LOGIN DE USUÁRIO
app.post("/login", (req: Request, res: Response) => {
  try {
    let result: user[] = users;

    if (req.body.email && req.body.password) {
      const userLog = result.find((user) => user.email == req.body.email);
      if (userLog) {
        const userId = result.findIndex((user) => user.email == req.body.email);

        const token = jwt.sign({ userId }, SECRET);
        console.log("Usuário Logado");
        return res.json({ auth: true, token });
      }
    }

    res.status(401).end();
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500).end();
    } else {
      res.end();
    }
  }
});

// ENDPOINT 3 - BUSCAR TODOS OS profissionais de psicologia
app.get("/profissionais", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (token) {
    const result = psychologists.map((psychologist) => ({
      id: psychologist.id,
      name: psychologist.name,
      email: psychologist.email,
      image: psychologist.image,
      field: psychologist.field,
      description: psychologist.description,
    }));

    res.status(200).send(result);
  }
});

// ENDPOINT 4 - BUSCAR UM profissionais de psicologia
app.get("/profissionais/:id", (req: Request, res: Response) => {
  const token = req.headers.authorization;

  const id = req.params.id;

  const result = psychologists.find((psychologist) => {
    return psychologist.id === Number(id);
  });

  if (token && result) {
    res.send(result);
  } else {
    res.status(404).send("Profissional não encontrado");
  }
});

// ENDPOINT 5 - CADASTRAR PROFISSIONAIS DE PSICOLOGIA
app.post("/cadastrarprofissionais", (req: Request, res: Response) => {
  try {
    let userId: number = psychologists.length + 1;

    let newUser: psychologist = {
      id: userId,
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      image: req.body.description,
      field: req.body.field,
    };

    if (req.body.name && req.body.email) {
      psychologists.push(newUser);
      const token = jwt.sign({ userId }, SECRET, { expiresIn: 300 });
      //console.log("Novo profissional adicionado");
      return res.json({ auth: true, token });
    }

    res.status(401).end();
  } catch (error: any) {
    if (res.statusCode === 200) {
      res.status(500).end();
    } else {
      res.end();
    }
  }
});
