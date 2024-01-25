export interface IUser {
  username: string;
  full_name: string;
}

export interface IEvent {
  id: string;
  name: string,
  description: string;
  date: string;
  created_at: string;
  is_closed: boolean;
  users: IUser[];
  host: IUser;
  deposits: IDeposit[],
  repayments: IRepayment[],
}

export interface IDeposit {
  id: string;
  user: IUser;
  value: number;
  description: string;
  event: string
  payed_at: string
}

export interface IRepayment {
  id: string;
  payer: IUser;
  recipient: IUser;
  value: number;
  description: string;
  event: string
  payed_at: string
}

export interface IDetailedUser extends IUser {
  balance: number,
  deposits: IDeposit[],
  repayments: IRepayment[],
  backRepayments: IRepayment[],
}

export interface IDetailedEvent extends IEvent {
  users: IDetailedUser[];
  bank: number,
}
