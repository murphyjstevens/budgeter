using Dapper;
using Npgsql;
using System.Collections.Generic;
using BudgeterApi.Models;
using BudgeterApi.Mocks;
using Microsoft.Extensions.Configuration;
using System;
using BudgeterApi.Requests;
using static Dapper.SqlMapper;
using System.Linq;

namespace BudgeterApi.Repositories
{
  public interface ICategoryRepository
  {
    IEnumerable<Category> Get();
    IEnumerable<Category> GetSimple();
    Category Create(Category category);
    Category Update(Category category);
    Tuple<Category, Category> Reorder(ReorderRequest request);
    void Delete(int id);
  }
  public class CategoryRepository : CoreRepository, ICategoryRepository
  {
    private const string RETURN_OBJECT = "id, name, budget, sort_order as SortOrder, category_group_id AS CategoryGroupId";

    public CategoryRepository(IConfiguration configuration) : base(configuration) { }

    public IEnumerable<Category> Get()
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        return connection.Query<Category>(
          $@"SELECT c.id, c.name, c.budget, c.sort_order as SortOrder, c.category_group_id as CategoryGroupId, coalesce(SUM(t.cost), 0::money) as Spent FROM category c
LEFT JOIN transaction t ON t.category_id = c.id
GROUP BY c.id, c.name, c.budget, c.category_group_id");
      }
      // return CategoryMock.Categories;
    }

    public IEnumerable<Category> GetSimple()
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        return connection.Query<Category>($"SELECT {RETURN_OBJECT} FROM category");
      }
      // return CategoryMock.Categories;
    }

    public Category Create(Category category)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        string sql = $@"INSERT INTO category (name, budget, sort_order, category_group_id) 
        VALUES (@Name, @Budget, @SortOrder, @CategoryGroupId)
        RETURNING {RETURN_OBJECT}";
        return connection.QueryFirstOrDefault<Category>(sql, category);
      }
    }

    public Category Update(Category category)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        string sql = $@"UPDATE category
        SET name = @Name, budget = @Budget, sort_order = @SortOrder, category_group_id = @CategoryGroupId
        WHERE id = @Id
        RETURNING {RETURN_OBJECT}";
        return connection.QueryFirstOrDefault<Category>(sql, category);
      }
    }

    public Tuple<Category, Category> Reorder(ReorderRequest request)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        string sql = $@"UPDATE category
            SET sort_order = @Item1SortOrder
            WHERE id = @Item1Id
            RETURNING {RETURN_OBJECT};
            
            UPDATE category
            SET sort_order = @Item2SortOrder
            WHERE id = @Item2Id
            RETURNING {RETURN_OBJECT};";

        GridReader gridReader = connection.QueryMultiple(sql, new {
            Item1Id = request.Item1.Id,
            Item1SortOrder = request.Item1.SortOrder,
            Item2Id = request.Item2.Id,
            Item2SortOrder = request.Item2.SortOrder
        });

        Category item1 = gridReader.Read<Category>().First();
        Category item2 = gridReader.Read<Category>().First();

        return new Tuple<Category, Category>(item1, item2);
      }
    }

    public void Delete(int id)
    {
      using (var connection = new NpgsqlConnection(ConnectionString))
      {
        connection.Open();
        string sql = @"DELETE FROM category WHERE id = @Id";
        connection.Execute(sql, new { Id = id });
      }
    }
  }
}