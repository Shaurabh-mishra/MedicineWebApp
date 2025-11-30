using MedApp.Core.Entities;
using MedApp.Core.Interfaces;
using MedApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MedApp.Infrastructure.Repositories;

public class MedicineRepository : IMedicineRepository
{
    private readonly AppDbContext _context;

    public MedicineRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Medicine>> GetAllAsync()
    {
        return await _context.Medicines.ToListAsync();
    }

    public async Task<Medicine?> GetByIdAsync(int id)
    {
        return await _context.Medicines.FindAsync(id);
    }

    public async Task<Medicine> AddAsync(Medicine medicine)
    {
        _context.Medicines.Add(medicine);
        await _context.SaveChangesAsync();
        return medicine;
    }

    public async Task<Medicine> UpdateAsync(Medicine medicine)
    {
        _context.Medicines.Update(medicine);
        await _context.SaveChangesAsync();
        return medicine;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var med = await _context.Medicines.FindAsync(id);
        if (med == null) return false;

        _context.Medicines.Remove(med);
        await _context.SaveChangesAsync();
        return true;
    }
}
