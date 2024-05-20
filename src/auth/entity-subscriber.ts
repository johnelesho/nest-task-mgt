import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent
} from "typeorm";
import { CurrentUserService } from "./current-user.service";
import { AbstractEntity } from "../abstract.entity";

@EventSubscriber()
export class EntitySubscriber implements EntitySubscriberInterface<AbstractEntity> {
  constructor(
    private currentUserSvc: CurrentUserService,
    // private connection: Connection,
  ) {
    // this.connection.subscribers.push(this);
  }
  beforeInsert(event: InsertEvent<AbstractEntity>) {
    console.log(`BEFORE ENTITY INSERTED: `, event.entity);
    event.entity.createdBy = this.currentUserSvc.getUsername() ?? "Elesho John";
  }
  afterInsert(event: InsertEvent<AbstractEntity>) {
    console.log(`AFTER ENTITY INSERTED: `, event.entity);
  }
  beforeUpdate(event: UpdateEvent<AbstractEntity>) {
    console.log(`BEFORE ENTITY UPDATED: `, event.entity);
    event.entity.updatedBy = this.currentUserSvc.getUsername();
  }
  afterUpdate(event: UpdateEvent<AbstractEntity>) {
    console.log(`AFTER ENTITY UPDATED: `, event.entity);
  }
}
