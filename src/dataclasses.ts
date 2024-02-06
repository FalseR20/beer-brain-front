import {IAction, IDeposit, IEvent, IRepayment, IUser} from "./interfaces.ts";

export class CUser {
  username: string
  fullName: string

  constructor(user: IUser) {
    this.username = user.username
    this.fullName = user.full_name
  }
}

export class CAction {
  id: string
  value: number
  description: string
  payedAt: Date
  event: string

  constructor(action: IAction) {
    this.id = action.id
    this.description = action.description
    this.value = parseFloat(action.value)
    this.payedAt = new Date(action.payed_at)
    this.event = action.event
  }
}

export class CDeposit extends CAction {
  user: CUser

  constructor(deposit: IDeposit) {
    super(deposit);
    this.user = new CUser(deposit.user)
  }
}

export class CRepayment extends CAction {
  payer: CUser
  recipient: CUser

  constructor(repayment: IRepayment) {
    super(repayment);
    this.payer = new CUser(repayment.payer)
    this.recipient = new CUser(repayment.recipient)
  }
}

export class CEvent {
  id: string
  name: string
  description: string
  date: Date
  created_at: Date
  isClosed: boolean
  users: CUser[]
  host: CUser
  deposits: CDeposit[]
  repayments: CRepayment[]

  constructor(event: IEvent) {
    this.id = event.id
    this.name = event.name
    this.description = event.description
    this.date = new Date(event.date)
    this.created_at = new Date(event.date)
    this.isClosed = event.is_closed
    this.users = event.users.map(user => new CUser(user))
    this.host = new CUser(event.host)
    this.deposits = event.deposits.map(deposit => new CDeposit(deposit))
    this.repayments = event.repayments.map(repayment => new CRepayment(repayment))
  }
}


export class CDetailedUser extends CUser {
  balance: number
  deposits: CDeposit[]
  repayments: CRepayment[]
  backRepayments: CRepayment[]

  constructor(user: IUser) {
    super(user)
    this.balance = 0
    this.deposits = []
    this.repayments = []
    this.backRepayments = []
  }

  public getSortedActions(): CAction[] {
    const actions: CAction[] = [...this.deposits, ...this.repayments, ...this.backRepayments]
    actions.sort((a, b) => a.payedAt.getTimezoneOffset() - b.payedAt.getTimezoneOffset())
    return actions
  }
}

export class CDetailedEvent extends CEvent {
  users: CDetailedUser[]
  bank: number
  bankPart: number

  constructor(event: IEvent) {
    super(event);
    const usersMap = new Map<string, CDetailedUser>();
    this.users = event.users.map(user => {
      const detailedUser: CDetailedUser = new CDetailedUser(user)
      usersMap.set(detailedUser.username, detailedUser);
      return detailedUser;
    });
    this.bank = 0
    this.deposits.forEach(deposit => {
      this.bank += deposit.value;
      const detailedUser = usersMap.get(deposit.user.username)!;
      detailedUser.deposits.push(deposit);
      detailedUser.balance += deposit.value;
    });

    this.repayments.forEach(repayment => {
      const payer = usersMap.get(repayment.payer.username)!;
      const recipient = usersMap.get(repayment.recipient.username)!;
      payer.balance += repayment.value;
      recipient.balance -= repayment.value;
      payer.repayments.push(repayment);
      recipient.backRepayments.push(repayment);
    });
    this.bankPart = this.bank / this.users.length
    this.users.map(user => user.balance -= this.bankPart)
  }
}
