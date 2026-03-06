using Microsoft.EntityFrameworkCore;
using EmployeeRegistry.Api.Entities;

namespace EmployeeRegistry.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Spouse> Spouses { get; set; }
        public DbSet<Child> Children { get; set; }
    }
}