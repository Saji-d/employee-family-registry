using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeRegistry.Api.Data;
using EmployeeRegistry.Api.Entities;
using EmployeeRegistry.Api.Services;

namespace EmployeeRegistry.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmployeePdfService _pdfService;

        public EmployeeController(AppDbContext context, EmployeePdfService pdfService)
        {
            _context = context;
            _pdfService = pdfService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return await _context.Employees
                .Include(e => e.Spouse)
                .Include(e => e.Children)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.Spouse)
                .Include(e => e.Children)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (employee == null)
                return NotFound();

            return employee;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Employee>>> SearchEmployees(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return await _context.Employees.ToListAsync();

            query = query.ToLower();

            var result = await _context.Employees
                .Where(e =>
                    e.Name.ToLower().Contains(query) ||
                    e.NID.Contains(query) ||
                    e.Department.ToLower().Contains(query))
                .ToListAsync();

            return result;
        }

        // CREATE EMPLOYEE
        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _context.Employees.AnyAsync(e => e.NID == employee.NID))
            {
                return BadRequest(new
                {
                    errors = new
                    {
                        NID = new[] { "NID must be unique" }
                    }
                });
            }

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        // ADD SPOUSE
        [HttpPost("{employeeId}/spouse")]
        public async Task<IActionResult> AddSpouse(int employeeId, Spouse spouse)
        {
            var employee = await _context.Employees
                .Include(e => e.Spouse)
                .FirstOrDefaultAsync(e => e.Id == employeeId);

            if (employee == null)
                return NotFound("Employee not found");

            if (employee.Spouse != null)
            {
                return BadRequest(new
                {
                    errors = new Dictionary<string, string[]>
            {
                { "Spouse", new[] { "An employee can only have one spouse." } }
            }
                });
            }

            bool nidExists =
                await _context.Employees.AnyAsync(e => e.NID == spouse.NID) ||
                await _context.Spouses.AnyAsync(s => s.NID == spouse.NID);

            if (nidExists)
            {
                return BadRequest(new
                {
                    errors = new Dictionary<string, string[]>
            {
                { "NID", new[] { "This NID already exists in the system." } }
            }
                });
            }

            spouse.EmployeeId = employeeId;

            _context.Spouses.Add(spouse);

            await _context.SaveChangesAsync();

            return Ok(spouse);
        }

        // ADD CHILD
        [HttpPost("{employeeId}/children")]
        public async Task<IActionResult> AddChild(int employeeId, Child child)
        {
            var employee = await _context.Employees.FindAsync(employeeId);

            if (employee == null)
                return NotFound("Employee not found");

            if (string.IsNullOrWhiteSpace(child.Name))
                return BadRequest(new
                {
                    errors = new Dictionary<string, string[]>
            {
                { "Name", new[] { "Child name is required" } }
            }
                });

            if (child.DateOfBirth == default)
                return BadRequest(new
                {
                    errors = new Dictionary<string, string[]>
            {
                { "DateOfBirth", new[] { "Date of Birth is required" } }
            }
                });

            child.EmployeeId = employeeId;

            _context.Children.Add(child);

            await _context.SaveChangesAsync();

            return Ok(child);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
        {
            if (id != employee.Id)
                return BadRequest();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _context.Employees.AnyAsync(e => e.NID == employee.NID && e.Id != id))
            {
                return BadRequest(new
                {
                    errors = new
                    {
                        NID = new[] { "Another employee already uses this NID" }
                    }
                });
            }

            _context.Entry(employee).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
                return NotFound();

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // EXPORT ALL EMPLOYEES
        [HttpGet("export/pdf")]
        public async Task<IActionResult> ExportEmployeesPdf(string? query)
        {
            IQueryable<Employee> employeesQuery = _context.Employees;

            if (!string.IsNullOrWhiteSpace(query))
            {
                query = query.ToLower();

                employeesQuery = employeesQuery.Where(e =>
                    EF.Functions.ILike(e.Name, $"%{query}%") ||
                    EF.Functions.ILike(e.Department, $"%{query}%") ||
                    EF.Functions.ILike(e.NID, $"%{query}%")
                );
            }

            var employees = await employeesQuery.ToListAsync();

            var pdf = _pdfService.GenerateEmployeesPdf(employees);

            return File(pdf, "application/pdf", "employees.pdf");
        }

        // EXPORT CV
        [HttpGet("{id}/export/cv")]
        public async Task<IActionResult> ExportEmployeeCv(int id)
        {
            var employee = await _context.Employees
                .Include(e => e.Spouse)
                .Include(e => e.Children)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (employee == null)
                return NotFound();

            var pdf = _pdfService.GenerateEmployeeCvPdf(employee);

            return File(pdf, "application/pdf", $"employee_{id}_cv.pdf");
        }
    }
}