using Dapper;
using Npgsql;
using System.Collections.Generic;
using System.Linq;
using BudgeterApi.Models;
using BudgeterApi.Mocks;
using Microsoft.Extensions.Configuration;

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

    public TransactionRepository(IConfiguration configuration) : base(configuration) { }

    public IEnumerable<Transaction> Get()
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        return connection.Query<Transaction>($"SELECT {TRANSACTION_SELECT} FROM transaction");
      }
      // return TransactionMock.Transactions;
    }
    public IEnumerable<Transaction> GetByAccount(int accountId)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        return connection.Query<Transaction>($"SELECT {TRANSACTION_SELECT} FROM transaction WHERE account_id = @AccountId", new { AccountId = accountId });
      }
      // return TransactionMock.Transactions.Where(transaction => transaction.AccountId == accountId);
    }

    public IEnumerable<Transaction> GetByCategory(int categoryId)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        return connection.Query<Transaction>($"SELECT {TRANSACTION_SELECT} FROM transaction WHERE category_id = @CategoryId", new { CategoryId = categoryId });
      }
      // return TransactionMock.Transactions.Where(transaction => transaction.CategoryId == categoryId);
    }

    public Transaction Create(Transaction transaction)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        string sql = $@"INSERT INTO transaction (account_id, date, cost, recipient, category_id) 
        VALUES (@AccountId, @Date, @Cost, @Recipient, @CategoryId)
        RETURNING {TRANSACTION_SELECT}";
        return connection.QueryFirstOrDefault<Transaction>(sql, transaction);
      }
    }

    public Transaction Update(Transaction transaction)
    {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        string sql = $@"UPDATE transaction
        SET account_id = @AccountId, date = @Date, cost = @Cost, recipient = @Recipient, category_id = @CategoryId
        WHERE id = @Id
        RETURNING {TRANSACTION_SELECT}";
        return connection.QueryFirstOrDefault<Transaction>(sql, transaction);
      }
    }

    public void Delete(int id) {
      using (var connection = new NpgsqlConnection(ConnectionString)) {
        connection.Open();
        string sql = @"DELETE FROM transaction WHERE id = @Id";
        connection.Execute(sql, new { Id = id });
      }
    }
  }
}