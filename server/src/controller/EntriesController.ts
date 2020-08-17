import { getRepository, LessThan, Raw, Between, Like } from "typeorm";
import { Entries } from "../entity/Entries";
import { Param, Body, Get, Post, Put, Delete, Res, Req, JsonController } from "routing-controllers";
import { validate } from "class-validator";
import { RandomWordGenerator } from "../util/RandomWordGenerator";
import { Utils } from "../util/Utils";

@JsonController()
export class EntriesController {
  private repository = getRepository(Entries);

  @Get("/entries/region/:region")
  async getAllViaRegion(@Param("region") region: string, @Res() res: any) {
    return await this.repository.find({
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
      where: [{ name: Like(`%${search}%`) }, { id: Like(`%${search}%`) }, { entryCode: Like(`%${search}%`) }],
    });

    data.map((item) => {
      item.createdAt = Utils.formatDate(item.createdAt);
      item.dateOfPayment = Utils.formatDate(item.dateOfPayment);
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
    const oldEntries = await this.repository.find({ select: ["accountNumber", "name", "isValid"] });
    try {
      validate(body).then((errors: any) => {
        if (errors.length > 0) {
          res.send(errors);
        }
      });

      oldEntries.forEach((oldItem) => {
        if (oldItem.name === body.name || oldItem.accountNumber === body.accountNumber) {
          body.isValid = oldItem.isValid;
        }
      });

      const newEntries = [];

      for (let i = 0; i < body.numberOfEntries; i++) {
        const entry: Entries = new Entries();
        entry.accountNumber = body.accountNumber;
        entry.ammountPaid = body.ammountPaid || 0;
        entry.paymentFacility = body.paymentFacility;
        entry.dateOfPayment = body.dateOfPayment;
        entry.region = body.region;
        entry.branch = body.branch;
        entry.name = body.name;
        entry.mobileNumber = body.mobileNumber;
        entry.isValid = body.isValid;
        entry.entryCode = RandomWordGenerator();

        newEntries.push(entry);
      }

      await this.repository.save(newEntries);
      res.send(`${body.name} has been successfully Added.`);
    } catch (error) {
      res.status(409).send(error);
    }
  }

  @Post("/entries/bulk")
  async postBulk(@Body() body: Entries, @Res() res: any) {
    validate(body).then((errors: any) => {
      if (errors.length > 0) {
        res.send(errors);
      }
    });
    delete body.numberOfEntries;
    await this.repository.save(body);
    res.send(`id: ${body.name} has been successfully Updated.`);
  }

  @Post("/entries/new/bulk")
  async postNewBulk(@Body() body: Entries[], @Res() res: any) {
    const oldEntries = await this.repository.find({ select: ["accountNumber", "name", "isValid"] });
    validate(body).then((errors: any) => {
      if (errors.length > 0) {
        res.send(errors);
      }
    });
    body.forEach((element, key) => {
      if (element.accountNumber === 0 || element.mobileNumber === null) {
        body.splice(key, 1);
      }
    });

    body.forEach((element) => {
      oldEntries.forEach((oldItem) => {
        if (oldItem.name === element.name || oldItem.accountNumber === element.accountNumber) {
          element.isValid = oldItem.isValid;
        }
      });
    });
    await this.repository.save(body);
    res.send(`data has been successfully Updated.`);
  }

  @Put("/entry/:id")
  async put(@Param("id") id: number, @Body() body: Entries, @Res() res: any) {
    validate(body).then((errors: any) => {
      if (errors.length > 0) {
        res.send(errors);
      }
    });
    delete body.numberOfEntries;
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
