// console.log("Hello, world!")
import express, { Request, Response } from "express";
import cors from "cors";
import { users } from "./data";
import { user } from "./types";

const app = express();
app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor pronto!");
});

// ENDPOINT 1 - BUSCAR TODOS OS USUÁRIOS
app.get("/users", (req: Request, res: Response) => {
  //   res.send(users)
  const result = users.map((user) => ({
    id: user.id,
    name: user.name,
  }));

  res.status(200).send(result);
});

// ENDPOINT 3 - Busca com filtros
app.get("/users/search", (req, res) => {
  let result: user[] = users;

  if (req.query.name) {
    result = result.filter((user) =>
      user.name.includes(req.query.name as string)
    );
  }

  if (req.query.capital) {
    result = result.filter((user) =>
      user.description.includes(req.query.capital as string)
    );
  }

  res.status(200).send(result);
});

// ENDPOINT 2 - BUSCAR USUÁRIO POR ID
app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  const result: user | undefined = users.find((user) => {
    return user.id === Number(id);
  });

  if (result) {
    res.send(result);
  } else {
    res.status(404).send("não encontrado");
  }
});

// ENDPOINT 4 - Editar USUÁRIO
app.put("/users/:id", (req, res) => {
  const id = req.params.id;

  const index: number | undefined = users.findIndex((user) => {
    return user.id === Number(id);
  });

  const User: user | undefined = users.find((user) => {
    return user.id === Number(id);
  });

  if (index !== -1 && User) {
    if (req.body.name && !req.body.capital) {
      User.name = req.body.name;
      users.splice(index, 1, User);
      res.status(200).send(users);
    } else if (req.body.capital && !req.body.name) {
      User.description = req.body.capital;
      users.splice(index, 1, User);
      res.status(200).send(users);
    } else {
      res.status(404).send("Parâmetro não permitido ou não encontrado");
      console.log(req.body.name);
    }
  } else {
    res.status(404).send("não encontrado");
  }
});
