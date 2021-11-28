import { type } from "os"


export type user = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type psychologist = {
  id: number;
  name: string;
  email: string;
  description: string;
  image: string;
  field: string;
};