using MedApp.Core.Entities;

namespace MedApp.Core.Interfaces;

public interface IMedicineRepository
{
    Task<IEnumerable<Medicine>> GetAllAsync();
    Task<Medicine?> GetByIdAsync(int id);
    Task<Medicine> AddAsync(Medicine medicine);
    Task<Medicine> UpdateAsync(Medicine medicine);
    Task<bool> DeleteAsync(int id);
}
