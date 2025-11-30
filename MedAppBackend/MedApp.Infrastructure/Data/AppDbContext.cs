using MedApp.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace MedApp.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Medicine> Medicines { get; set; }
}
