export default class {
  static getAccounts() {
    return [
      { id: 1, name: 'Checking', url: 'checking' }, 
      { id: 2, name: 'Credit Card', url: 'credit-card' }
    ];
  }

  static getAccount(url) {
    return this.getAccounts().find(account => account.url === url);
  }
}