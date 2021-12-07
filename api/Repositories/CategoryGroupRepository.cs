using BudgeterApi.Models;
using BudgeterApi.Requests;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace BudgeterApi.Repositories;

public interface ICategoryGroupRepository
{
  Task<IEnumerable<CategoryGroup>> Get();
  Task<CategoryGroup> Create(CategoryGroup categoryGroup);
  Task<CategoryGroup> Update(CategoryGroup categoryGroup);
  Task<Tuple<CategoryGroup, CategoryGroup>> Reorder(Tuple<ReorderItemRequest, ReorderItemRequest>  request);
  Task Delete(int id);
}
public class CategoryGroupRepository : CoreRepository, ICategoryGroupRepository
{
  private const string RETURN_OBJECT = "id, name, sort_order as SortOrder";

  public CategoryGroupRepository(IConfiguration configuration) : base(configuration) { }

  public async Task<IEnumerable<CategoryGroup>> Get()
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      return await connection.QueryAsync<CategoryGroup>($"SELECT {RETURN_OBJECT} FROM category_group");
    }
  }

  public async Task<CategoryGroup> Create(CategoryGroup categoryGroup)
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      string sql = $@"INSERT INTO category_group (name, sort_order) 
      VALUES (@Name, @SortOrder)
      RETURNING {RETURN_OBJECT}";
      return await connection.QueryFirstOrDefaultAsync<CategoryGroup>(sql, categoryGroup);
    }
  }

  public async Task<CategoryGroup> Update(CategoryGroup categoryGroup)
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      string sql = $@"UPDATE category_group
      SET name = @Name, sort_order = @SortOrder
      WHERE id = @Id
      RETURNING {RETURN_OBJECT}";
      return await connection.QueryFirstOrDefaultAsync<CategoryGroup>(sql, categoryGroup);
    }
  }

  public async Task<Tuple<CategoryGroup, CategoryGroup>> Reorder(Tuple<ReorderItemRequest, ReorderItemRequest>  request)
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      string sql = $@"UPDATE category_group
          SET sort_order = @Item1SortOrder
          WHERE id = @Item1Id
          RETURNING {RETURN_OBJECT};
          
          UPDATE category_group
          SET sort_order = @Item2SortOrder
          WHERE id = @Item2Id
          RETURNING {RETURN_OBJECT};";

      GridReader gridReader = await connection.QueryMultipleAsync(sql, new {
          Item1Id = request.Item1.Id,
          Item1SortOrder = request.Item1.SortOrder,
          Item2Id = request.Item2.Id,
          Item2SortOrder = request.Item2.SortOrder
      });

      CategoryGroup item1 = (await gridReader.ReadAsync<CategoryGroup>()).First();
      CategoryGroup item2 = (await gridReader.ReadAsync<CategoryGroup>()).First();

      return new Tuple<CategoryGroup, CategoryGroup>(item1, item2);
    }
  }

  public async Task Delete(int id)
  {
    using (var connection = new NpgsqlConnection(ConnectionString))
    {
      await connection.OpenAsync();
      string sql = @"DELETE FROM category_group WHERE id = @Id";
      await connection.ExecuteAsync(sql, new { Id = id });
    }
  }
}
