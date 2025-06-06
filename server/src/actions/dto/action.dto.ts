import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Action } from '../entities/action.entity';
import { UserAction, UserActionRelation } from '../entities/user-action.entity';
import { ActionEvent, ActionStatus } from '../entities/action-event.entity';

export class UserActionDto extends PickType(UserAction, [
  'status',
  'deadline',
  'dateCommitted',
  'dateCompleted',
]) {}

export class ActionEventDto extends PickType(ActionEvent, [
  'message',
  'newStatus',
  'sendNotifsTo',
  'updateDate',
  'showInTimeline',
]) {
  constructor(partial: Partial<ActionEventDto>) {
    super();
    Object.assign(this, partial);
  }
}

export class ActionDto extends OmitType(Action, [
  'createdAt',
  'updatedAt',
  'userRelations',
  'events',
]) {
  @ApiProperty({ type: UserActionDto })
  myRelation?: Omit<UserActionDto, 'action'> | null;

  @ApiProperty()
  usersJoined: number;

  @ApiProperty({ type: [ActionEventDto] })
  events: ActionEventDto[];

  constructor(action: Partial<Action>) {
    super();
    this.myRelation = null; 
    this.usersJoined =
      action.userRelations?.filter(
        (ur) => ur.status === UserActionRelation.joined,
      ).length || 0;
    this.events =
      action.events?.map(
        (event) =>
          new ActionEventDto({...event}),
      ) || [];
  }
}

export class PublicActionDto extends OmitType(ActionDto, ['myRelation']) {}

export class CreateActionDto extends OmitType(ActionDto, [
  'id',
  'usersJoined',
  'myRelation',
]) {}

export class ActionWithRelationDto extends PublicActionDto {
  @ApiProperty({ type: UserActionDto })
  relation?: Omit<UserActionDto, 'action'> | null;
}

export class UpdateActionDto extends PartialType(CreateActionDto) {
  @ApiProperty({ type: String, description: 'Message describing the update' })
  message?: string;

  @ApiProperty({
    enum: ['active', 'upcoming', 'past', 'draft'],
    description: 'The new status of the action',
  })
  newStatus?: ActionStatus;

  @ApiProperty({
    enum: ['all', 'joined', 'none'],
    description: 'Who should receive notifications',
  })
  sendNotifs?: 'all' | 'joined' | 'none';

  @ApiProperty({ type: Date, description: 'Date of the update' })
  updateDate?: Date;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the update should appear in the timeline',
  })
  showInTimeline?: boolean;
}
