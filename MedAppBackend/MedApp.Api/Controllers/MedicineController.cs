using MedApp.Core.Entities;
using MedApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace MedApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicineController : ControllerBase
{
    private readonly MedicineService _service;

    public MedicineController(MedicineService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAll());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var med = await _service.GetById(id);
        if (med == null) return NotFound();
        return Ok(med);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Medicine medicine)
        => Ok(await _service.Add(medicine));

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Medicine medicine)
    {
        if (id != medicine.MedicineId)
            return BadRequest("ID mismatch");

        return Ok(await _service.Update(medicine));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
        => Ok(await _service.Delete(id));
}
