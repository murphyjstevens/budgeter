using BudgeterApi.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Collections.Generic;
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
    }

    public async Task<Account> FindByUrl(string url)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        await connection.OpenAsync();
        return await connection.QueryFirstOrDefaultAsync<Account>("SELECT * FROM account WHERE url = @Url", new { Url = url });
      }
    }
  }
}