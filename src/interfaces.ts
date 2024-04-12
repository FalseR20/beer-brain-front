export interface IPagination {
  count: number
  next: string | null
  previous: string | null
}

export interface IPaginated<T> extends IPagination {
  results: T[]
}

export interface IUser {
  username: string
  full_name: string
}

export interface IAction {
  id: string
  value: string
  description: string
  payed_at: string
  event: string
}

export interface IDeposit extends IAction {
  user: IUser
}

export interface IRepayment extends IAction {
  payer: IUser
  recipient: IUser
}

export interface IEvent {
  id: string
  name: string
  description: string
  date: string
  created_at: string
  is_closed: boolean
  users: IUser[]
  host: IUser
  deposits: IDeposit[]
  repayments: IRepayment[]
}
