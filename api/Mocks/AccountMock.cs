using System.Linq;
using System.Collections.Generic;
using BudgeterApi.Models;

namespace BudgeterApi.Mocks 
{
  public static class AccountMock 
  {
    public static IEnumerable<Account> Accounts = new List<Account> 
    {
      new Account { Id = 1, Name = "Checking", Url = "checking" },
      new Account { Id = 2, Name = "Credit Card", Url = "credit-card" }
    };
  }
}