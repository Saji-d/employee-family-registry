using System.ComponentModel.DataAnnotations;

namespace EmployeeRegistry.Api.Entities
{
    public class Spouse
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Spouse name is required")]
        [StringLength(100, ErrorMessage = "Spouse name cannot exceed 100 characters")]
        public string Name { get; set; } = "";

        [Required(ErrorMessage = "Spouse NID is required")]
        [RegularExpression(@"^\d{10}$|^\d{17}$", ErrorMessage = "NID must be 10 or 17 digits")]
        public string NID { get; set; } = "";

        public int EmployeeId { get; set; }

        public Employee? Employee { get; set; }
    }
}