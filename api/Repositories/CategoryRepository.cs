using Api.Models;
using Api.Requests;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace Api.Repositories;

public interface ICategoryRepository
{
  Task<IEnumerable<Category>> Get(DateTime date);
  Task<IEnumerable<Category>> GetSimple();
  Task<Category> Create(Category category);
  Task<Category> Update(Category category);
  Task<Tuple<Category, Category>> Reorder(Tuple<ReorderItemRequest, ReorderItemRequest> request);
  Task Delete(int id);
}
public class CategoryRepository : CoreRepository, ICategoryRepository
{
  private const string RETURN_OBJECT = "id, name, sort_order as SortOrder, category_group_id AS CategoryGroupId";

  public CategoryRepository(IConfiguration configuration) : base(configuration) { }

  public async Task<IEnumerable<Category>> Get(DateTime date)
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      return await connection.QueryAsync<Category>(
        $@"
SELECT category_id, SUM(cost) as cost
  INTO TEMP temp_transaction
  FROM transaction
  WHERE EXTRACT(MONTH FROM @Date) = EXTRACT(MONTH FROM date) AND EXTRACT(YEAR FROM @Date) = EXTRACT(YEAR FROM date)
  GROUP BY category_id;

SELECT category_id, SUM(cost) AS cost
  INTO TEMP temp_all_transaction
  FROM transaction
  WHERE date < CAST(DATE_TRUNC('month', @Date + interval '1 month') AS date)
  GROUP BY category_id;

SELECT category_id, SUM(assigned) AS assigned
  INTO TEMP temp_budget
  FROM budget
  WHERE EXTRACT(MONTH FROM @Date) = EXTRACT(MONTH FROM date) AND EXTRACT(YEAR FROM @Date) = EXTRACT(YEAR FROM date)
  GROUP BY category_id;

SELECT category_id, SUM(assigned) AS assigned
  INTO TEMP temp_all_budget
  FROM budget
  WHERE date < CAST(DATE_TRUNC('month', @Date + interval '1 month') AS date)
  GROUP BY category_id;

SELECT
    c.id,
    c.name,
    c.sort_order AS SortOrder,
    c.category_group_id AS CategoryGroupId,
    COALESCE(t.cost, 0::money) AS Spent,
    (ab.assigned + COALESCE(at.cost, 0::money)) AS Available,
    b.assigned AS Budget
  FROM category c
  LEFT JOIN temp_transaction t ON t.category_id = c.id
  LEFT JOIN temp_all_transaction at ON at.category_id = c.id
  LEFT JOIN temp_budget b ON b.category_id = c.id
  LEFT JOIN temp_all_budget ab ON ab.category_id = c.id;", new { Date = date });
    }
  }

  public async Task<IEnumerable<Category>> GetSimple()
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      return await connection.QueryAsync<Category>($"SELECT {RETURN_OBJECT} FROM category");
    }
  }

  public async Task<Category> Create(Category category)
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      string sql = $@"INSERT INTO category (name, sort_order, category_group_id) 
      VALUES (@Name, @SortOrder, @CategoryGroupId)
      RETURNING {RETURN_OBJECT}";
      return await connection.QueryFirstOrDefaultAsync<Category>(sql, category);
    }
  }

  public async Task<Category> Update(Category category)
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      string sql = $@"UPDATE category
      SET name = @Name, sort_order = @SortOrder, category_group_id = @CategoryGroupId
      WHERE id = @Id
      RETURNING {RETURN_OBJECT}";
      return await connection.QueryFirstOrDefaultAsync<Category>(sql, category);
    }
  }

  public async Task<Tuple<Category, Category>> Reorder(Tuple<ReorderItemRequest, ReorderItemRequest> request)
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      string sql = $@"UPDATE category
          SET sort_order = @Item1SortOrder
          WHERE id = @Item1Id
          RETURNING {RETURN_OBJECT};
          
          UPDATE category
          SET sort_order = @Item2SortOrder
          WHERE id = @Item2Id
          RETURNING {RETURN_OBJECT};";

      GridReader gridReader = await connection.QueryMultipleAsync(sql, new {
          Item1Id = request.Item1.Id,
          Item1SortOrder = request.Item1.SortOrder,
          Item2Id = request.Item2.Id,
          Item2SortOrder = request.Item2.SortOrder
      });

      Category item1 = (await gridReader.ReadAsync<Category>()).First();
      Category item2 = (await gridReader.ReadAsync<Category>()).First();

      return new Tuple<Category, Category>(item1, item2);
    }
  }

  public async Task Delete(int id)
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      string sql = @"DELETE FROM budget WHERE category_id = @Id;
        DELETE FROM category WHERE id = @Id";
      await connection.ExecuteAsync(sql, new { Id = id });
    }
  }
}
