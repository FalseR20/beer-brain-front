export interface IUser {
  username: string;
  full_name: string;
}

export interface IEvent {
  id: number;
  name: string,
  description: string;
  date: string;
  created_at: string;
  is_closed: boolean;
  users: IUser[];
  host: IUser;
}

export interface IDetailedEvent extends IEvent {
  users: IDetailedUser[];
}

export interface IDetailedUser extends IUser {
  deposits: IDetailedDeposit[];
  repayments: IDetailedRepayment[];
}

export interface IDetailedDeposit {
  id: string;
  user: IUser;
  value: number;
  description: string;
}

export interface IDetailedRepayment {
  id: string;
  payer: IUser;
  recipient: IUser;
  value: number;
  description: string;
}

export interface IDeposit {
  id: string;
  user: IUser;
  value: number;
  description: string;
  event: string
}

export interface IRepayment {
  id: string;
  payer: IUser;
  recipient: IUser;
  value: number;
  description: string;
  event: string
}

