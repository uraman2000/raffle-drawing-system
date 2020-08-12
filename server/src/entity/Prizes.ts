import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsNotEmpty, IsString, IsEnum, IsNumber } from "class-validator";
import { JSONSchema } from "class-validator-jsonschema";

enum freqeuncy {
  Everyday = "Everyday",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Yearly = "Yearly",
}
@Entity()
export class Prizes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @IsEnum(freqeuncy, {
    message: "freqeuncy must be Everyday, Weekly, Monthly or Yearly",
  })
  frequency: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  @JSONSchema({
    example: 1,
  })
  numOfWinnersPerDraw: number;
}
