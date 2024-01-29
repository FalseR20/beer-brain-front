export interface IUser {
  username: string,
  fullName: string,
}

export interface IEvent {
  id: string,
  name: string,
  description: string,
  date: Date,
  created_at: Date,
  isClosed: boolean,
  users: IUser[],
  host: IUser,
  deposits: IDeposit[],
  repayments: IRepayment[],
}

export interface IAction {
  id: string,
  value: number,
  description: string,
  payedAt: Date,
  event: string,
}

export interface IDeposit extends IAction {
  user: IUser,
}

export interface IRepayment extends IAction {
  payer: IUser,
  recipient: IUser,
}

export interface IDetailedUser extends IUser {
  balance: number,
  deposits: IDeposit[],
  repayments: IRepayment[],
  backRepayments: IRepayment[],
}

export interface IDetailedEvent extends IEvent {
  users: IDetailedUser[],
  bank: number,
}
