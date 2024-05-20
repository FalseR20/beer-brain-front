import {
  IAction,
  IDeposit,
  IEvent,
  INotification,
  IPagination,
  IRepayment,
  IUser
} from "./interfaces.ts";
import {make_front_url, UrlsFront} from "./urls.ts";


export class CPaginated<C> {
  count: number
  next: string | null
  previous: string | null
  results: C[]

  constructor(pagination: IPagination, results: C[]) {
    this.count = pagination.count
    this.next = pagination.next
    this.previous = pagination.previous
    this.results = results
  }
}

export class CUser {
  id: number
  username: string
  fullName: string

  constructor(user?: IUser) {
    this.id = user?.id || 0
    this.username = user?.username || ""
    this.fullName = user?.full_name || ""
  }

  public get fullNameOrUsername() {
    return this.fullName || this.username
  }

  public equals(other: CUser): boolean {
    return this.username == other.username
  }

  public equalsFull(other: CUser): boolean {
    return this.username == other.username && this.fullName == other.fullName
  }
}

export abstract class CAction {
  id: string
  value: number
  description: string
  payedAt: Date
  event: string

  protected constructor(action: IAction) {
    this.id = action.id
    this.description = action.description
    this.value = parseFloat(action.value)
    this.payedAt = new Date(action.payed_at)
    this.event = action.event
  }

  abstract makeFrontHref(): string
}

export class CDeposit extends CAction {
  user: CUser

  constructor(deposit: IDeposit) {
    super(deposit);
    this.user = new CUser(deposit.user)
  }

  makeFrontHref() {
    return make_front_url(UrlsFront.DEPOSIT, {
      eventId: this.event,
      depositId: this.id
    })
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

  makeFrontHref() {
    return make_front_url(UrlsFront.REPAYMENT, {
      eventId: this.event,
      repaymentId: this.id
    })
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
    this.sortDeposits()
  }

  public sortDeposits() {
    this.deposits.sort((a, b) => b.payedAt.getTime() - a.payedAt.getTime())
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

  public getSortedActions(): (CDeposit | CRepayment)[] {
    const actions: (CDeposit | CRepayment)[] = [...this.deposits, ...this.repayments, ...this.backRepayments]
    actions.sort((a, b) => b.payedAt.getTime() - a.payedAt.getTime())
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
    this.bank = Math.round(this.bank * 100) / 100
    this.bankPart = Math.ceil((this.bank / this.users.length) * 100) / 100;
    const centsLeft = Math.round((this.bankPart * this.users.length - this.bank) * 100)
    this.users.forEach((user, index) => {
      user.balance -= this.bankPart
      if (index < centsLeft) {
        user.balance += 0.01
      }
    })
    this.sortUsers()
  }

  public sortUsers() {
    this.users.sort((a, b) => a.balance - b.balance)
  }

  public getSortedActions(): (CDeposit | CRepayment)[] {
    const actions: (CDeposit | CRepayment)[] = [...this.deposits, ...this.repayments]
    actions.sort((a, b) => b.payedAt.getTime() - a.payedAt.getTime())
    return actions
  }
}

export class CNotification {
  id: number
  message: string
  createdAt: Date
  is_read: boolean

  constructor(notification: INotification) {
    this.id = notification.id
    this.message = notification.message
    this.createdAt = new Date(notification.created_at)
    this.is_read = notification.is_read
  }
}
