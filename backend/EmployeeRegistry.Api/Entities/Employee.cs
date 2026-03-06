using System.ComponentModel.DataAnnotations;

namespace EmployeeRegistry.Api.Entities
{
    public class Employee
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = "";

        [Required]
        [RegularExpression(@"^\d{10}$|^\d{17}$", ErrorMessage = "NID must be 10 or 17 digits")]
        public string NID { get; set; } = "";

        [Required]
        [RegularExpression(@"^(01|\+8801)[0-9]{9}$", ErrorMessage = "Invalid BD phone number")]
        public string Phone { get; set; } = "";

        [Required]
        public string Department { get; set; } = "";

        public decimal BasicSalary { get; set; }

        public Spouse? Spouse { get; set; }

        public List<Child>? Children { get; set; }
    }
}