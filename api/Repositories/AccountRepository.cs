using Dapper;
using Npgsql;
using System.Collections.Generic;
using System.Linq;
using BudgeterApi.Models;
using BudgeterApi.Mocks;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace BudgeterApi.Repositories
{
  public interface IAccountRepository
  {
    Task<IEnumerable<Account>> Get();
    Task<Account> FindByUrl(string url);
  }
  public class AccountRepository : CoreRepository, IAccountRepository
  {
    public AccountRepository(IConfiguration configuration) : base(configuration) { }

    public async Task<IEnumerable<Account>> Get()
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        await connection.OpenAsync();
        return await connection.QueryAsync<Account>("SELECT * FROM account");
      }
      // return AccountMock.Accounts;
    }

    public async Task<Account> FindByUrl(string url)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        await connection.OpenAsync();
        return await connection.QueryFirstOrDefaultAsync<Account>("SELECT * FROM account WHERE url = @Url", new { Url = url });
      }
      // return AccountMock.Accounts.First(account => account.Url == url);
    }
  }
}