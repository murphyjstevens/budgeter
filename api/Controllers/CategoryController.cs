using BudgeterApi.Exceptions;
using BudgeterApi.Models;
using BudgeterApi.Repositories;
using BudgeterApi.Requests;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace BudgeterApi.Controllers;

[ApiController]
[Route("categories")]
public class CategoryController : ControllerBase
{
  private readonly ILogger<CategoryController> _logger;
  private readonly ICategoryRepository _repository;

  public CategoryController(ILogger<CategoryController> logger, ICategoryRepository repository)
  {
      _logger = logger;
      _repository = repository;
  }

  [HttpGet]
  public async Task<IEnumerable<Category>> Get([FromQuery]DateTime date)
  {
    return await _repository.Get(date);
  }

  [HttpGet]
  [Route("Simple")]
  public async Task<IEnumerable<Category>> GetSimple()
  {
    return await _repository.GetSimple();
  }

  [HttpPost]
  public async Task<Category> Create(Category category)
  {
    return await _repository.Create(category);
  }

  [HttpPut]
  public async Task<Category> Update(Category category)
  {
    return await _repository.Update(category);
  }

  [HttpPatch]
  [Route("reorder")]
  public async Task<Tuple<Category, Category>> Reorder(Tuple<ReorderItemRequest, ReorderItemRequest> request)
  {
    if (request.Item1 == null || request.Item1.Id <= 0 || request.Item1.SortOrder < 0
      || request.Item2 == null || request.Item2.Id <= 0 || request.Item2.SortOrder < 0
      || (request.Item1.SortOrder + 1 != request.Item2.SortOrder && request.Item1.SortOrder - 1 != request.Item2.SortOrder))
    {
      throw new HttpResponseException(HttpStatusCode.BadRequest, "Request is invalid.");
    }
    return await _repository.Reorder(request);
  }

  [HttpDelete]
  [Route("{id}")]
  public async Task Delete(int id)
  {
    await _repository.Delete(id);
  }
}
