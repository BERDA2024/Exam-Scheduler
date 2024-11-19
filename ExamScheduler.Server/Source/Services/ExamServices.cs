using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Services
{
    public class ExamService
    {
        private readonly ApplicationDbContext _context;

        public ExamService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Obține toate examenele
        public async Task<List<Exam>> GetAllExamsAsync()
        {
            return await _context.Exam
                .Include(e => e.Room)
                .Include(e => e.Professor)
                .ToListAsync();
        }

        // Obține un examen după ID
        public async Task<Exam> GetExamByIdAsync(int id)
        {
            var exam = await _context.Exam
                .Include(e => e.Room)
                .Include(e => e.Professor)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
            {
                throw new KeyNotFoundException($"Exam with ID {id} not found.");
            }

            return exam;
        }

        // Adaugă un nou examen
        public async Task AddExamAsync(Exam exam)
        {
            // Validare simplă: camera trebuie să existe
            if (!await _context.Room.AnyAsync(r => r.Id == exam.RoomId))
            {
                throw new KeyNotFoundException($"Room with ID {exam.RoomId} not found.");
            }

            // Validare simplă: profesorul trebuie să existe
            if (!await _context.Professor.AnyAsync(p => p.Id == exam.ProfessorId))
            {
                throw new KeyNotFoundException($"Professor with ID {exam.ProfessorId} not found.");
            }

            // Adăugare examen
            _context.Exam.Add(exam);
            await _context.SaveChangesAsync();
        }

        // Actualizează un examen existent
        public async Task UpdateExamAsync(Exam exam)
        {
            // Validare: examenul trebuie să existe
            if (!await _context.Exam.AnyAsync(e => e.Id == exam.Id))
            {
                throw new KeyNotFoundException($"Exam with ID {exam.Id} not found.");
            }

            // Validare suplimentară pentru room și professor (opțional)
            if (!await _context.Room.AnyAsync(r => r.Id == exam.RoomId))
            {
                throw new KeyNotFoundException($"Room with ID {exam.RoomId} not found.");
            }

            if (!await _context.Professor.AnyAsync(p => p.Id == exam.ProfessorId))
            {
                throw new KeyNotFoundException($"Professor with ID {exam.ProfessorId} not found.");
            }

            // Actualizare
            _context.Exam.Update(exam);
            await _context.SaveChangesAsync();
        }

        // Șterge un examen după ID
        public async Task DeleteExamAsync(int id)
        {
            var exam = await _context.Exam.FindAsync(id);

            if (exam == null)
            {
                throw new KeyNotFoundException($"Exam with ID {id} not found.");
            }

            _context.Exam.Remove(exam);
            await _context.SaveChangesAsync();
        }
    }
}
