using Dapper;
using Npgsql;
using System.Collections.Generic;
using BudgeterApi.Models;

namespace BudgeterApi.Repositories
{
  public interface ITransactionRepository
  {
    IEnumerable<Transaction> Get();
    IEnumerable<Transaction> GetByAccount(int accountId);
    IEnumerable<Transaction> GetByCategory(int categoryId);
    Transaction Create(Transaction transaction);
    Transaction Update(Transaction transaction);
    void Delete(int id);
  }
  public class TransactionRepository : CoreRepository, ITransactionRepository
  {
    private const string TRANSACTION_SELECT = "id, account_id AS AccountId, date, cost, recipient, category_id AS CategoryId";
    public IEnumerable<Transaction> Get()
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        return connection.Query<Transaction>($"SELECT {TRANSACTION_SELECT} FROM transactions");
      }
    }
    public IEnumerable<Transaction> GetByAccount(int accountId)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        return connection.Query<Transaction>($"SELECT {TRANSACTION_SELECT} FROM transactions WHERE account_id = @AccountId", new { AccountId = accountId });
      }
    }

    public IEnumerable<Transaction> GetByCategory(int categoryId)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        return connection.Query<Transaction>($"SELECT {TRANSACTION_SELECT} FROM transactions WHERE category_id = @CategoryId", new { CategoryId = categoryId });
      }
    }

    public Transaction Create(Transaction transaction)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        string sql = $@"INSERT INTO transactions (id, account_id, date, cost, recipient, category_id) 
        VALUES (@Id, @AccountId, @Date, @Cost, @Recipient, @CategoryId)
        RETURNING {TRANSACTION_SELECT}";
        return connection.QueryFirstOrDefault<Transaction>(sql, transaction);
      }
    }

    public Transaction Update(Transaction transaction)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        string sql = $@"UPDATE transactions 
        SET account_id = @AccountId, date = @Date, cost = @Cost, recipient = @Recipient, category_id = @CategoryId
        WHERE id = @Id
        RETURNING {TRANSACTION_SELECT}";
        return connection.QueryFirstOrDefault<Transaction>(sql, transaction);
      }
    }

    public void Delete(int id) {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        string sql = @"DELETE FROM transactions WHERE id = @Id";
        connection.Execute(sql, new { Id = id });
      }
    }
  }
}