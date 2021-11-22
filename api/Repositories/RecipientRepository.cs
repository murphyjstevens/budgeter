using Dapper;
using Npgsql;
using System.Collections.Generic;
using BudgeterApi.Models;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace BudgeterApi.Repositories
{
  public interface IRecipientRepository
  {
    Task<IEnumerable<Recipient>> Get();
    Task<Recipient> Create(Recipient recipient);
    Task<Recipient> Update(Recipient recipient);
    Task Delete(int id);
  }
  public class RecipientRepository : CoreRepository, IRecipientRepository
  {
    private const string RECIPIENT_SELECT = "id, name";

    public RecipientRepository(IConfiguration configuration) : base(configuration) { }

    public async Task<IEnumerable<Recipient>> Get()
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        await connection.OpenAsync();
        return await connection.QueryAsync<Recipient>($"SELECT {RECIPIENT_SELECT} FROM recipient");
      }
    }

    public async Task<Recipient> Create(Recipient recipient)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        await connection.OpenAsync();
        string sql = $@"INSERT INTO recipient (name) 
        VALUES (@Name)
        RETURNING {RECIPIENT_SELECT}";
        return await connection.QueryFirstOrDefaultAsync<Recipient>(sql, recipient);
      }
    }

    public async Task<Recipient> Update(Recipient recipient)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        await connection.OpenAsync();
        string sql = $@"UPDATE recipient
        SET name = @Name
        WHERE id = @Id
        RETURNING {RECIPIENT_SELECT}";
        return await connection.QueryFirstOrDefaultAsync<Recipient>(sql, recipient);
      }
    }

    public async Task Delete(int id) {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        await connection.OpenAsync();
        string sql = @"DELETE FROM recipient WHERE id = @Id";
        await connection.ExecuteAsync(sql, new { Id = id });
      }
    }
  }
}