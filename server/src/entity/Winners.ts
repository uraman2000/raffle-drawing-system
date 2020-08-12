import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { IsNotEmpty, IsString, IsInt } from "class-validator";
import { JSONSchema } from "class-validator-jsonschema";

@Entity()
export class Winners {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsInt()
  @JSONSchema({
    example: 2,
  })
  entryID: number;

  @Column()
  @IsNotEmpty()
  @IsInt()
  @JSONSchema({
    example: 2,
  })
  prizeID: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  prizeName: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;
}
