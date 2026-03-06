using EmployeeRegistry.Api.Entities;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace EmployeeRegistry.Api.Services
{
    public class EmployeePdfService
    {
        public byte[] GenerateEmployeesPdf(List<Employee> employees)
        {
            var pdf = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(20);

                    page.Header().Text("Employee Registry")
                        .FontSize(20)
                        .Bold()
                        .AlignCenter();

                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("Name").Bold();
                            header.Cell().Text("Department").Bold();
                            header.Cell().Text("Phone").Bold();
                            header.Cell().Text("Salary").Bold();
                        });

                        foreach (var emp in employees)
                        {
                            table.Cell().Text(emp.Name);
                            table.Cell().Text(emp.Department);
                            table.Cell().Text(emp.Phone);
                            table.Cell().Text(emp.BasicSalary.ToString());
                        }
                    });
                });
            });

            return pdf.GeneratePdf();
        }

        public byte[] GenerateEmployeeCvPdf(Employee employee)
        {
            var pdf = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(30);

                    page.Header()
                        .Text("Employee Profile")
                        .FontSize(20)
                        .Bold()
                        .AlignCenter();

                    page.Content().Column(column =>
                    {
                        column.Spacing(10);

                        column.Item().Text($"Name: {employee.Name}");
                        column.Item().Text($"Department: {employee.Department}");
                        column.Item().Text($"Phone: {employee.Phone}");
                        column.Item().Text($"NID: {employee.NID}");
                        column.Item().Text($"Salary: {employee.BasicSalary}");

                        column.Item().PaddingTop(10).Text("Spouse").Bold();

                        if (employee.Spouse != null)
                        {
                            column.Item().Text(employee.Spouse.Name);
                        }
                        else
                        {
                            column.Item().Text("No spouse information");
                        }

                        column.Item().PaddingTop(10).Text("Children").Bold();

                        if (employee.Children != null && employee.Children.Any())
                        {
                            foreach (var child in employee.Children)
                            {
                                column.Item().Text($"{child.Name} (DOB: {child.DateOfBirth:yyyy-MM-dd})");
                            }
                        }
                        else
                        {
                            column.Item().Text("No children recorded");
                        }
                    });
                });
            });

            return pdf.GeneratePdf();
        }
    }
}