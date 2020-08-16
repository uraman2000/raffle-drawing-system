import { getRepository, LessThan, Raw, Between, Like } from "typeorm";
import { Entries } from "../entity/Entries";
import { Param, Body, Get, Post, Put, Delete, Res, Req, JsonController } from "routing-controllers";
import { validate, IsString } from "class-validator";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import config from "../util/config";
import { JSONSchema } from "class-validator-jsonschema";

class refreshToken {
  @IsString()
  @JSONSchema({
    example: "string",
  })
  refresh_token: string;
}
@JsonController()
export class AuthController {
  private repository = getRepository(User);
  @Post("/auth")
  async login(@Body() body: User, @Res() res: any) {
    //Check if username and password are set
    const { username, password, id } = body;

    validate(body).then((errors: any) => {
      if (errors.length > 0) {
        res.send(errors);
      }
    });

    //Get user from database
    try {
      const user: User = await this.repository.findOne({
        where: { username: username },
      });
      if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        res.status(401).send("Invalid Username or Password");
      }
    } catch (error) {
      res.status(401).send("Invalid Username or Password");
    }

    //Sing JWT, valid for 1 hour
    const token = jwtSign(username);

    //Send the jwt in the response
    res.status(200).send({
      access_token: token,
    });
  }

  @Post("/auth/refresh")
  async refreshToken(@Body() body: refreshToken, @Res() res: any) {
    let { refresh_token } = body;
    let jwtPayload;

    try {
      jwtPayload = <any>jwt.verify(refresh_token, config.refreshTokenSecret);
    } catch (error) {
      //If token is not valid, respond with 401 (unauthorized)
      res.status(401).send(error);
      return;
    }
    const token = jwtSign(jwtPayload.username);

    res.status(200).send({
      access_token: token,
    });
  }
}

function jwtSign(username) {
  const refresh_token = jwt.sign({ username }, config.refreshTokenSecret, {
    expiresIn: "30d",
  });
  return jwt.sign({ username, refresh_token }, config.tokenSecret, {
    expiresIn: "8h",
  });
}
