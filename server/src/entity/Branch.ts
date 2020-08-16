import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { IsNotEmpty, IsString, IsInt, Min, IsNotIn, IsBoolean, IsNumber } from "class-validator";
import { JSONSchema } from "class-validator-jsonschema";
import { isString } from "util";

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  @IsNotIn(["NLR,SLR,VIS,NMR,EMR,SMR"])
  @JSONSchema({
    example: "NLR",
  })
  region: string;

  @Column()
  @IsString()
  branch: string;
}
