using System.ComponentModel.DataAnnotations;

namespace EmployeeRegistry.Api.Entities
{
    public class Child
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Child name is required")]
        [StringLength(100, ErrorMessage = "Child name cannot exceed 100 characters")]
        public string Name { get; set; } = "";

        [Required(ErrorMessage = "Date of Birth is required")]
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        public int EmployeeId { get; set; }

        public Employee? Employee { get; set; }
    }
}