using EmployeeRegistry.Api.Entities;

namespace EmployeeRegistry.Api.Data
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context)
        {
            if (context.Employees.Any())
                return;

            var employees = new List<Employee>
            {
                new Employee { Name="Tanvir Hasan", NID="1234567890", Phone="01712345678", Department="IT", BasicSalary=55000 },
                new Employee { Name="Rahim Uddin", NID="1234567891", Phone="01722345678", Department="HR", BasicSalary=40000 },
                new Employee { Name="Karim Ahmed", NID="1234567892", Phone="01732345678", Department="Finance", BasicSalary=48000 },
                new Employee { Name="Sadia Akter", NID="1234567893", Phone="01742345678", Department="IT", BasicSalary=60000 },
                new Employee { Name="Moushumi Khan", NID="1234567894", Phone="01752345678", Department="Marketing", BasicSalary=45000 },
                new Employee { Name="Arif Rahman", NID="1234567895", Phone="01762345678", Department="Sales", BasicSalary=42000 },
                new Employee { Name="Nusrat Jahan", NID="1234567896", Phone="01772345678", Department="IT", BasicSalary=62000 },
                new Employee { Name="Hasan Mahmud", NID="1234567897", Phone="01782345678", Department="Support", BasicSalary=38000 },
                new Employee { Name="Shakil Ahmed", NID="1234567898", Phone="01792345678", Department="HR", BasicSalary=41000 },
                new Employee { Name="Farhana Islam", NID="1234567899", Phone="01812345678", Department="Finance", BasicSalary=47000 }
            };

            context.Employees.AddRange(employees);
            context.SaveChanges();
        }
    }
}