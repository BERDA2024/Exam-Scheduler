using ExamScheduler.Server.Source.Entities;
using ExamScheduler.Server.Source.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExamScheduler.Server.Source.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamController : ControllerBase
    {
        private readonly ExamService _examService;

        public ExamController(ExamService examService)
        {
            _examService = examService;
        }

        // Get all exams
        [HttpGet]
        public async Task<IActionResult> GetAllExams()
        {
            var exams = await _examService.GetAllExamsAsync();
            return Ok(exams);
        }

        // Get exam by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetExamById(int id)
        {
            var exam = await _examService.GetExamByIdAsync(id);
            if (exam == null)
            {
                return NotFound(new { message = $"Exam with ID {id} not found." });
            }
            return Ok(exam);
        }

        // Create a new exam
        [HttpPost]
        public async Task<IActionResult> CreateExam([FromBody] Exam exam)
        {
            if (exam == null)
            {
                return BadRequest(new { message = "Exam data cannot be null." });
            }

            try
            {
                await _examService.AddExamAsync(exam);
                return CreatedAtAction(nameof(GetExamById), new { id = exam.Id }, exam);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the exam.", details = ex.Message });
            }
        }

        // Update an existing exam
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExam(int id, [FromBody] Exam exam)
        {
            if (exam == null || id != exam.Id)
            {
                return BadRequest(new { message = "Exam data is invalid or ID mismatch." });
            }

            // Check if the exam exists before updating
            var existingExam = await _examService.GetExamByIdAsync(id);
            if (existingExam == null)
            {
                return NotFound(new { message = $"Exam with ID {id} not found." });
            }

            try
            {
                await _examService.UpdateExamAsync(exam);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the exam.", details = ex.Message });
            }
        }

        // Delete an exam
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            // Check if the exam exists before deleting
            var existingExam = await _examService.GetExamByIdAsync(id);
            if (existingExam == null)
            {
                return NotFound(new { message = $"Exam with ID {id} not found." });
            }

            try
            {
                await _examService.DeleteExamAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the exam.", details = ex.Message });
            }
        }
    }
}
