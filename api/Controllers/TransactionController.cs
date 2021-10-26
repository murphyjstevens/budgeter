using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BudgeterApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using BudgeterApi.Mocks;
using BudgeterApi.Repositories;

namespace BudgeterApi.Controllers
{
  [ApiController]
  [Route("Transactions")]
  public class TransactionController : ControllerBase
  {
    private readonly ILogger<TransactionController> _logger;
    private readonly ITransactionRepository _repository;

    public TransactionController(ILogger<TransactionController> logger, ITransactionRepository repository)
    {
        _logger = logger;
        _repository = repository;
    }

    [HttpGet]
    [Route("")]
    public IEnumerable<Transaction> Get()
    {
      return _repository.Get();
    }

    [HttpGet]
    [Route("Account/{accountId}")]
    public IEnumerable<Transaction> GetByAccount(int accountId)
    {
      return _repository.GetByAccount(accountId);
    }

    [HttpGet]
    [Route("Category/{categoryId}")]
    public IEnumerable<Transaction> GetByCategory(int categoryId)
    {
      return _repository.GetByCategory(categoryId);
    }

    [HttpPost]
    [Route("")]
    public Transaction Create(Transaction transaction)
    {
      return _repository.Create(transaction);
    }

    [HttpPut]
    [Route("")]
    public Transaction Update(Transaction transaction)
    {
      return _repository.Update(transaction);
    }

    [HttpDelete]
    [Route("{id}")]
    public void Delete(int id)
    {
      _repository.Delete(id);
    }
  }
}
