import { getRepository, LessThan, Raw, Between, Like } from "typeorm";
import {
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Res,
  Req,
  JsonController,
  UseBefore,
  HeaderParam,
} from "routing-controllers";
import { validate } from "class-validator";
import { Winners } from "../entity/Winners";
import { checkJwt } from "../middlewares/checkJwt";

@JsonController()
export class WinnersController {
  private repository = getRepository(Winners);

  @Get("/winners")
  @UseBefore(checkJwt)
  getAll(@HeaderParam("access_token") token: string) {
    return this.repository.find();
  }

  @Get("/winners/paginate")
  async paginate(@Res() res: any, @Req() req: any) {
    const page = req.query.page * 1;
    const limit = req.query.limit * 1;
    const search = req.query.search || "";

    // res.status(ResponseCodes.OK).send(filter);
    let data: any = {};
    const result = {};
    const startIndex = (page - 1) * limit;

    data = await this.repository.find({
      order: {
        id: "DESC",
      },
      take: limit,
      skip: startIndex,
      where: {
        name: Like(`%${search}%`),
      },
    });

    const count = await this.repository.count({
      take: limit,
      skip: startIndex,
      where: {
        name: Like(`%${search}%`),
      },
    });

    result["data"] = data;
    result["page"] = page;
    result["total"] = count;
    res.send(result);
  }

  @Get("/winner/:id")
  @UseBefore(checkJwt)
  one(@HeaderParam("access_token") token: string, @Param("id") id: number) {
    return this.repository.findOne(id);
  }

  @Post("/winners")
  @UseBefore(checkJwt)
  async save(@HeaderParam("access_token") token: string, @Body() body: Winners, @Res() res: any) {
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

  @Put("/winner/:id")
  @UseBefore(checkJwt)
  async put(
    @HeaderParam("access_token") token: string,
    @Param("id") id: number,
    @Body() body: Winners,
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
  @UseBefore(checkJwt)
  async remove(@HeaderParam("access_token") token: string, @Param("id") id: number, @Res() res: any) {
    let student = await this.repository.findOneOrFail(id);
    await this.repository.remove(student);
    return res.send(`id: ${id} has been removed.`);
  }
}
