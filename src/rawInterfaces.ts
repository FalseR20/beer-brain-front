import {IDeposit, IEvent, IRepayment, IUser} from "./interfaces.ts";

export interface IRawUser {
  username: string,
  full_name: string,
}

export interface IRawDeposit {
  id: string,
  value: string,
  description: string,
  payed_at: string,
  user: IRawUser,
  event: string,
}

export interface IRawRepayment {
  id: string,
  value: string,
  description: string,
  payed_at: string,
  payer: IRawUser,
  recipient: IRawUser,
  event: string,
}

export interface IRawEvent {
  id: string,
  name: string,
  description: string,
  date: string,
  created_at: string,
  is_closed: boolean,
  users: IRawUser[],
  host: IRawUser,
  deposits: IRawDeposit[],
  repayments: IRawRepayment[],
}

export function rawToUser(user: IRawUser): IUser {
  return {
    username: user.username,
    fullName: user.full_name,
  }
}

export function rawToDeposit(deposit: IRawDeposit): IDeposit {
  return {
    id: deposit.id,
    description: deposit.description,
    value: parseFloat(deposit.value),
    payedAt: new Date(deposit.payed_at),
    event: deposit.event,
    user: rawToUser(deposit.user),
  }
}

export function rawToRepayment(repayment: IRawRepayment): IRepayment {
  return {
    id: repayment.id,
    description: repayment.description,
    value: parseFloat(repayment.value),
    payedAt: new Date(repayment.payed_at),
    event: repayment.event,
    payer: rawToUser(repayment.payer),
    recipient: rawToUser(repayment.recipient),
  }
}

export function rawToEvent(event: IRawEvent): IEvent {
  return {
    id: event.id,
    name: event.name,
    description: event.description,
    date: new Date(event.date),
    created_at: new Date(event.date),
    isClosed: event.is_closed,
    users: event.users.map(rawToUser),
    host: rawToUser(event.host),
    deposits: event.deposits.map(rawToDeposit),
    repayments: event.repayments.map(rawToRepayment),
  }
}
