using Dapper;
using Npgsql;
using System.Collections.Generic;
using BudgeterApi.Models;

namespace BudgeterApi.Repositories
{
  public interface IAccountRepository
  {
    IEnumerable<Account> Get();
    Account FindByUrl(string url);
  }
  public class AccountRepository : CoreRepository, IAccountRepository
  {
    public IEnumerable<Account> Get()
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        return connection.Query<Account>("SELECT * FROM accounts");
      }
    }

    public Account FindByUrl(string url)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        return connection.QueryFirstOrDefault<Account>("SELECT * FROM accounts WHERE url = @Url", new { Url = url });
      }
    }
  }
}