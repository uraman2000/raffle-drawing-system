import { getRepository, LessThan, Raw, Between, Like } from "typeorm";
import { Entries } from "../entity/Entries";
import { Param, Body, Get, Post, Put, Delete, Res, Req, JsonController } from "routing-controllers";
import { validate } from "class-validator";

@JsonController()
export class EntriesController {
  private repository = getRepository(Entries);

  @Get("/entries/:month/:region")
  async getAllThisMonth(@Param("month") month: number, @Param("region") region: string, @Res() res: any) {
    const MM = month.toString().padStart(2, "0");
    const Mmplus1 = (month + 1).toString().padStart(2, "0");
    const d = new Date();
    const yyyy = d.getFullYear();
    return await this.repository.find({
      entryDate: Between(`${yyyy}-${MM}-01`, `${yyyy}-${Mmplus1}-01`),
      isValid: true,
      region: region,
    });
  }

  @Get("/entries/paginate")
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
      where: [{ name: Like(`%${search}%`) }, { id: Like(`%${search}%`) }],
    });

    const count = await this.repository.count({
      take: limit,
      skip: startIndex,
      where: [{ name: Like(`%${search}%`) }, { id: Like(`%${search}%`) }],
    });

    result["data"] = data;
    result["page"] = page;
    result["total"] = count;
    res.send(result);
  }

  @Get("/entries")
  getAll() {
    return this.repository.find();
  }

  @Get("/entry/:id")
  one(@Param("id") id: number) {
    return this.repository.findOne(id);
  }

  @Post("/entries")
  async save(@Body() body: Entries, @Res() res: any) {
    try {
      validate(body).then((errors: any) => {
        if (errors.length > 0) {
          res.send(errors);
        }
      });
      await this.repository.save(body);
      res.send(`${body.name} has been successfully Added.`);
    } catch (error) {
      res.status(409).send(error);
    }
  }

  @Put("/entry/:id")
  async put(@Param("id") id: number, @Body() body: Entries, @Res() res: any) {
    validate(body).then((errors: any) => {
      if (errors.length > 0) {
        res.send(errors);
      }
    });

    await this.repository.update({ id: id }, body);
    res.send(`id: ${id} has been successfully Updated.`);
  }

  @Delete("/entry/:id")
  async remove(@Param("id") id: number, @Res() res: any) {
    let student = await this.repository.findOneOrFail(id);
    await this.repository.remove(student);
    return res.send(`id: ${id} has been removed.`);
  }
}
