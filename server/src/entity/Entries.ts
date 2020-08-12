import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { IsNotEmpty, IsString, IsInt, Min, IsNotIn, IsBoolean } from "class-validator";
import { JSONSchema } from "class-validator-jsonschema";

@Entity()
export class Entries {
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
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsInt()
  @Min(10)
  @JSONSchema({
    example: 9123456789,
  })
  mobileNumber: number;

  @Column()
  @IsNotEmpty()
  @IsBoolean()
  @JSONSchema({
    example: true,
  })
  isValid: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;
}
