import { getRepository, LessThan, Raw, Between, Like } from "typeorm";
import { Param, Body, Get, Post, Put, Delete, Res, Req, JsonController, HeaderParam, UseBefore } from "routing-controllers";
import { validate } from "class-validator";
import { User } from "../entity/User";
import { checkJwt } from "../middlewares/checkJwt";

@JsonController()
@UseBefore(checkJwt)
export class UserController {
  private repository = getRepository(User);

  @Get("/users")
  getAll(@HeaderParam("access_token") token: string) {
    return this.repository.find();
  }

  @Get("/user/:id")
  one(@HeaderParam("access_token") token: string, @Param("id") id: number) {
    return this.repository.findOne(id);
  }

  @Post("/users")
  async save(@HeaderParam("access_token") token: string, @Body() body: User, @Res() res: any) {
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
  async put(
    @HeaderParam("access_token") token: string,
    @Param("id") id: number,
    @Body() body: User,
    @Res() res: any
  ) {
    validate(body).then((errors: any) => {
      if (errors.length > 0) {
        res.send(errors);
      }
    });

    await this.repository.update({ id: id }, body);
    res.send(`id: ${id} has been successfully Updated.`);
  }

  @Delete("/winner/:id")
  async remove(@HeaderParam("access_token") token: string, @Param("id") id: number, @Res() res: any) {
    let student = await this.repository.findOneOrFail(id);
    await this.repository.remove(student);
    return res.send(`id: ${id} has been removed.`);
  }
}
