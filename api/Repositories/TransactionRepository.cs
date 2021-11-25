using BudgeterApi.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BudgeterApi.Repositories
{
  public interface ITransactionRepository
  {
    Task<IEnumerable<Transaction>> Get();
    Task<IEnumerable<Transaction>> GetByAccount(int accountId);
    Task<IEnumerable<Transaction>> GetByCategory(int categoryId);
    Task<Transaction> Create(Transaction transaction);
    Task<Transaction> Update(Transaction transaction);
    Task Delete(int id);
  }
  public class TransactionRepository : CoreRepository, ITransactionRepository
  {
    private const string TRANSACTION_SELECT = "id, account_id AS AccountId, date, cost, recipient_id AS RecipientId, category_id AS CategoryId";

    public TransactionRepository(IConfiguration configuration) : base(configuration) { }

    public async Task<IEnumerable<Transaction>> Get()
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        await connection.OpenAsync();
        return await connection.QueryAsync<Transaction>($"SELECT {TRANSACTION_SELECT} FROM transaction");
      }
    }
    public async Task<IEnumerable<Transaction>> GetByAccount(int accountId)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        await connection.OpenAsync();
        return await connection.QueryAsync<Transaction>($"SELECT {TRANSACTION_SELECT} FROM transaction WHERE account_id = @AccountId", new { AccountId = accountId });
      }
    }

    public async Task<IEnumerable<Transaction>> GetByCategory(int categoryId)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        await connection.OpenAsync();
        return await connection.QueryAsync<Transaction>($"SELECT {TRANSACTION_SELECT} FROM transaction WHERE category_id = @CategoryId", new { CategoryId = categoryId });
      }
    }

    public async Task<Transaction> Create(Transaction transaction)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        await connection.OpenAsync();
        string sql = $@"INSERT INTO transaction (account_id, date, cost, recipient_id, category_id) 
        VALUES (@AccountId, @Date, @Cost, @RecipientId, @CategoryId)
        RETURNING {TRANSACTION_SELECT}";
        return await connection.QueryFirstOrDefaultAsync<Transaction>(sql, transaction);
      }
    }

    public async Task<Transaction> Update(Transaction transaction)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        await connection.OpenAsync();
        string sql = $@"UPDATE transaction
        SET account_id = @AccountId, date = @Date, cost = @Cost, recipient_id = @RecipientId, category_id = @CategoryId
        WHERE id = @Id
        RETURNING {TRANSACTION_SELECT}";
        return await connection.QueryFirstOrDefaultAsync<Transaction>(sql, transaction);
      }
    }

    public async Task Delete(int id) {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        await connection.OpenAsync();
        string sql = @"DELETE FROM transaction WHERE id = @Id";
        await connection.ExecuteAsync(sql, new { Id = id });
      }
    }
  }
}