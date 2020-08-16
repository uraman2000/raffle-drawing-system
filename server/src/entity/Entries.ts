import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { IsNotEmpty, IsString, IsInt, Min, IsNotIn, IsBoolean, IsNumber } from "class-validator";
import { JSONSchema } from "class-validator-jsonschema";

@Entity()
export class Entries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  @JSONSchema({
    example: 9123456789,
  })
  accountNumber: number;

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
  branch: string;

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
  @JSONSchema({
    example: 9123456789,
  })
  ammountPaid: number;

  @Column()
  paymentFacility: String;

  @Column()
  @JSONSchema({
    example: "08-15-2020",
  })
  dateOfPayment: Date;

  @Column()
  entryCode: string;

  @Column()
  @IsNotEmpty()
  @IsBoolean()
  @JSONSchema({
    example: true,
  })
  isValid: boolean;

  @IsNumber()
  @JSONSchema({
    example: 5,
  })
  numberOfEntries: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;
}
