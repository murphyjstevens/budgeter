using Dapper;
using Npgsql;
using System.Collections.Generic;
using System.Linq;
using BudgeterApi.Models;
using BudgeterApi.Mocks;
using Microsoft.Extensions.Configuration;

namespace BudgeterApi.Repositories
{
  public interface IAccountRepository
  {
    IEnumerable<Account> Get();
    Account FindByUrl(string url);
  }
  public class AccountRepository : CoreRepository, IAccountRepository
  {

    public AccountRepository(IConfiguration configuration) : base(configuration) { }

    public IEnumerable<Account> Get()
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        return connection.Query<Account>("SELECT * FROM account");
      }
      // return AccountMock.Accounts;
    }

    public Account FindByUrl(string url)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        return connection.QueryFirstOrDefault<Account>("SELECT * FROM account WHERE url = @Url", new { Url = url });
      }
      // return AccountMock.Accounts.First(account => account.Url == url);
    }
  }
}