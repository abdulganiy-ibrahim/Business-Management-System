using BusinessManagementApi.Model;
using BusinessManagementApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BusinessManagementApi.Controller;

[ApiController]
[Route("api/business/{businessId}/products")]
[Authorize]
public class BusinessProductController : ControllerBase
{
  private readonly ProductService _productService;

  public BusinessProductController(ProductService productService)
  {
    _productService = productService;
  }

  [HttpPost]
  public IActionResult Create(Guid businessId, CreateProductRecord newProduct)
  {
    var user = (UserRecord)HttpContext.Items["CurrentUser"]!;

    try
    {
      var productId = _productService.Create(user.Id, businessId, newProduct);
      return Ok(productId);
    } catch (KeyNotFoundException ex)
    {
      return NotFound(new 
      {
        message = ex.Message
      });
    }
  }

  [HttpGet]
  public IActionResult GetByBusinessId(Guid businessId)
  {
    var user = (UserRecord)HttpContext.Items["CurrentUser"]!;

    try
    {
      var products = _productService.GetByBusinessId(user.Id, businessId);
      return Ok(products); 
    } catch (KeyNotFoundException ex)
    {
      return NotFound(ex.Message);
    }
  }

  [HttpGet("{productId}")]
  public IActionResult GetById(Guid businessId, int productId)
  {
    var user = (UserRecord)HttpContext.Items["CurrentUser"]!;

    try
    {
      var product = _productService.GetById(user.Id, businessId, productId);
      return Ok(product);
    } catch (KeyNotFoundException ex)
    {
      return NotFound(ex.Message);
    }
  }

  [HttpPatch("{productId}")]
  [Authorize]
  public IActionResult Update(Guid businessId, int productId, UpdateProductRecord request)
  {
    var user = (UserRecord)HttpContext.Items["CurrentUser"]!;

    try
    {
      var updated = _productService.Update(user.Id, businessId, productId, request);

      if (!updated)
      {
          return NotFound("Product not found or nothing to update.");
      }

      return NoContent();
    }
    catch (KeyNotFoundException ex)
    {
        return NotFound(ex.Message);
    }
  }

  [HttpDelete("{productId}")]
  public IActionResult DeleteById(Guid businessId, int productId)
  {
    var user = (UserRecord)HttpContext.Items["CurrentUser"]!;

    try
    {
      _productService.DeleteById(user.Id, businessId, productId);

      return NoContent();
    } catch (KeyNotFoundException ex)
    {
      return NotFound(ex.Message);
    }
  }
}