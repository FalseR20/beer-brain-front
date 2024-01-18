export interface IDetailedEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  created_at: string;
  is_closed: boolean;
  users: IDetailedUser[];
}

interface IUser {
  username: string;
  full_name: string;
}

interface IDetailedUser extends IUser {
  deposits: IDetailedDeposit[];
  repayments: IDetailedRepayment[];
}

interface IDetailedDeposit {
  id: string;
  user: IUser;
  value: number;
  description: string;
}

interface IDetailedRepayment {
  id: string;
  payer: IUser;
  recipient: IUser;
  value: number;
  description: string;
}
