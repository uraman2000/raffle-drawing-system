import { getRepository } from "typeorm";
import { Param, Body, Get, Post, Put, Delete, Res, Req, JsonController } from "routing-controllers";
import { validate } from "class-validator";
import { Branch } from "../entity/Branch";
import { debug } from "console";

@JsonController()
export class BranchController {
  private repository = getRepository(Branch);

  @Get("/branches/lookup")
  async lookUp(@Res() res: any) {
    let branches: Branch[] = await this.repository.find();
    let obj = {};

    branches.forEach((element: Branch) => {
      obj[element.branch] = element.branch;
    });
    console.log(obj);
    res.status(200).send(obj);
  }

  @Get("/branches")
  getAll() {
    return this.repository.find();
  }

  @Get("/branch/:id")
  one(@Param("id") id: number) {
    return this.repository.findOne(id);
  }

  @Post("/branches")
  async save(@Body() body: Branch, @Res() res: any) {
    try {
      validate(body).then((errors: any) => {
        if (errors.length > 0) {
          res.send(errors);
        }
      });
      await this.repository.save(body);
      res.send(`ID: ${body.id} has been successfully Added.`);
    } catch (error) {
      res.status(409).send(error);
    }
  }

  @Put("/branch/:id")
  async put(@Param("id") id: number, @Body() body: Branch, @Res() res: any) {
    validate(body).then((errors: any) => {
      if (errors.length > 0) {
        res.send(errors);
      }
    });

    await this.repository.update({ id: id }, body);
    res.send(`id: ${id} has been successfully Updated.`);
  }

  @Delete("/branch/:id")
  async remove(@Param("id") id: number, @Res() res: any) {
    let student = await this.repository.findOneOrFail(id);
    await this.repository.remove(student);
    return res.send(`id: ${id} has been removed.`);
  }
}
