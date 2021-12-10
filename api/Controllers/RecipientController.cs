using System.Collections.Generic;
using Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Api.Repositories;
using System.Threading.Tasks;

namespace Api.Controllers;

[ApiController]
public class RecipientController : ControllerBase
{
  private readonly ILogger<RecipientController> _logger;
  private readonly IRecipientRepository _repository;

  public RecipientController(ILogger<RecipientController> logger, IRecipientRepository repository)
  {
      _logger = logger;
      _repository = repository;
  }

  [HttpGet]
  [Route("recipients")]
  public async Task<IEnumerable<Recipient>> Get()
  {
    return await _repository.Get();
  }

  [HttpPost]
  [Route("recipients")]
  public async Task<Recipient> Create(Recipient transaction)
  {
    return await _repository.Create(transaction);
  }

  [HttpPut]
  [Route("recipients")]
  public async Task<Recipient> Update(Recipient transaction)
  {
    return await _repository.Update(transaction);
  }

  [HttpDelete]
  [Route("recipients/{id}")]
  public async Task Delete(int id)
  {
    await _repository.Delete(id);
  }
}
