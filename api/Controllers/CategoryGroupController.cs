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
[Route("category-groups")]
public class CategoryGroupController : ControllerBase
{
  private readonly ILogger<CategoryGroupController> _logger;
  private readonly ICategoryGroupRepository _repository;

  public CategoryGroupController(ILogger<CategoryGroupController> logger, ICategoryGroupRepository repository)
  {
    _logger = logger;
    _repository = repository;
  }

  [HttpGet]
  public async Task<IEnumerable<CategoryGroup>> Get()
  {
    return await _repository.Get();
  }

  [HttpPost]
  public async Task<CategoryGroup> Create(CategoryGroup group)
  {
    return await _repository.Create(group);
  }

  [HttpPut]
  public async Task<CategoryGroup> Update(CategoryGroup group)
  {
    return await _repository.Update(group);
  }

  [HttpPatch]
  [Route("reorder")]
  public async Task<Tuple<CategoryGroup, CategoryGroup>> Reorder(Tuple<ReorderItemRequest, ReorderItemRequest>  request)
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
