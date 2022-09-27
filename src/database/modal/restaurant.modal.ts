import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("RESTAURANT_DB")
export class RestaurantModal {

    @PrimaryGeneratedColumn("increment", {
        name: 'id',
    })
    id: number

    @Column({name: 'board_id', nullable: false})
    boardId: number

    @Column({name: 'restaurant', nullable: false})
    restaurant: string

    @Column({name: 'weight', nullable: false})
    weight: number

    @Column({name: 'people_limit', nullable: false, default: -1})
    peopleLimit: number

}