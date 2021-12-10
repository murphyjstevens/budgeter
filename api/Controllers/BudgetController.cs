using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Api.Repositories;
using System;

namespace Api.Controllers;

[ApiController]
[Route("budgets")]
public class BudgetController : ControllerBase
{
  private readonly ILogger<BudgetController> _logger;
  private readonly IBudgetRepository _repository;

  public BudgetController(ILogger<BudgetController> logger, IBudgetRepository repository)
  {
      _logger = logger;
      _repository = repository;
  }

  [HttpGet]
  public async Task<IEnumerable<Budget>> Get([FromQuery]DateTime date)
  {
    return await _repository.Get(date);
  }

  [HttpGet]
  [Route("ready-to-budget")]
  public async Task<double> GetReadyToBudget()
  {
    return await _repository.GetReadyToBudget();
  }

  [HttpPost]
  public async Task<Budget> Save(Budget budget)
  {
    return await _repository.Save(budget);
  }

  [HttpDelete]
  [Route("{id}")]
  public async Task Delete(int id)
  {
    await _repository.Delete(id);
  }
}
