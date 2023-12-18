import "reflect-metadata";
import express from "express";
import { useExpressServer } from "routing-controllers";

import { IService } from "types/services";
import { controllers } from "app/domain";
import { middlewares } from "app/middlewares";

//Клас Тсp, який реалізує інтерфейс IService

export class Tcp implements IService {
  private static instance: Tcp; //! Посилання на єдиний екземпляр класу

  private routePrefix = "/api"; //* Префікс для маршруів API
  public server = express();

  constructor() {
    if (!Tcp.instance) {
      Tcp.instance = this;
    }

    return Tcp.instance;
  }

  async init() {
    const { server, routePrefix } = this;

    server.use(express.json());

    useExpressServer(server, {
      routePrefix,
      controllers,
      middlewares,
      cors: true,
      defaultErrorHandler: true,
      validation: false,
    });

    return new Promise<boolean>((resolve) => {
      server.listen(4000, () => {
        console.log("Tcp service started on port 4000");
      });

      return resolve(true);
    });
  }
}
