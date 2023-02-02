// @ts-nocheck
import {Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("RESTAURANT_DB")
export class RestaurantModel {

    @PrimaryGeneratedColumn("increment", {
        name: 'id',
    })
    id: number

    @Column({name: 'display_id', nullable: true})
    displayId: number

    @Column({name: 'board_id', nullable: false})
    boardId: number

    @Column({name: 'restaurant', nullable: false})
    restaurant: string

    @Column({name: 'weight', nullable: false})
    weight: number

    @Column({name: 'people_limit', nullable: false, default: -1})
    peopleLimit: number

    @CreateDateColumn({name: 'create_timestamp', nullable: false})
    createTimestamp?: Date

    @DeleteDateColumn({name: 'delete_timestamp', nullable: true})
    deleteTimestamp?: Date

}