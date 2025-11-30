using MedApp.Core.Entities;
using MedApp.Core.Interfaces;

namespace MedApp.Services;

public class MedicineService
{
    private readonly IMedicineRepository _repo;

    public MedicineService(IMedicineRepository repo)
    {
        _repo = repo;
    }

    public Task<IEnumerable<Medicine>> GetAll() => _repo.GetAllAsync();

    public Task<Medicine?> GetById(int id) => _repo.GetByIdAsync(id);

    public Task<Medicine> Add(Medicine med) => _repo.AddAsync(med);

    public Task<Medicine> Update(Medicine med) => _repo.UpdateAsync(med);

    public Task<bool> Delete(int id) => _repo.DeleteAsync(id);
}
