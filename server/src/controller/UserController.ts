import { getRepository, LessThan, Raw, Between, Like } from "typeorm";
import { Param, Body, Get, Post, Put, Delete, Res, Req, JsonController } from "routing-controllers";
import { validate } from "class-validator";
import { User } from "../entity/User";

@JsonController()
export class UserController {
  private repository = getRepository(User);

  @Get("/users")
  getAll() {
    return this.repository.find();
  }

  @Get("/user/:id")
  one(@Param("id") id: number) {
    return this.repository.findOne(id);
  }

  @Post("/users")
  async save(@Body() body: User, @Res() res: any) {
    try {
      validate(body).then((errors: any) => {
        if (errors.length > 0) {
          res.send(errors);
        }
      });
      body.hashPassword();
      await this.repository.save(body);
      res.send(`user : ${body.username} has been successfully Added.`);
    } catch (error) {
      res.status(409).send(error);
    }
  }

  @Put("/user/:id")
  async put(@Param("id") id: number, @Body() body: User, @Res() res: any) {
    validate(body).then((errors: any) => {
      if (errors.length > 0) {
        res.send(errors);
      }
    });

    await this.repository.update({ id: id }, body);
    res.send(`id: ${id} has been successfully Updated.`);
  }

  @Delete("/winner/:id")
  async remove(@Param("id") id: number, @Res() res: any) {
    let student = await this.repository.findOneOrFail(id);
    await this.repository.remove(student);
    return res.send(`id: ${id} has been removed.`);
  }
}
