import { Entity, Column } from "typeorm"
import { CommonEntity } from "./common"

@Entity("collection")
export class CollectionEntity extends CommonEntity {

    @Column()
    url!: string

    @Column()
    username!: string

    @Column()
    serviceType!: string
    
    @Column({default: "30"})
    interval!: string
}