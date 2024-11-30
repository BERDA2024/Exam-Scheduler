using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using Microsoft.EntityFrameworkCore;

namespace ExamScheduler.Server.Source.Services
{
    public class ScheduleRequestService
    {
        private readonly ApplicationDbContext _context;

        public ScheduleRequestService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ScheduleRequest>> GetAllScheduleRequestsAsync()
        {
            return await _context.ScheduleRequest
                .Include(r => r.StudentID)
                .Include(r => r.SubjectID)
                .Include(r => r.ClassroomID)
                .Include(r => r.RequestStateID)
                .ToListAsync();
        }

        public async Task<ScheduleRequest?> GetScheduleRequestByIdAsync(int id)
        {
            return await _context.ScheduleRequest
                .Include(r => r.StudentID)
                .Include(r => r.SubjectID)
                .Include(r => r.ClassroomID)
                .Include(r => r.RequestStateID)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<ScheduleRequest> CreateScheduleRequestAsync(ScheduleRequest request)
        {
            _context.ScheduleRequest.Add(request);
            await _context.SaveChangesAsync();
            return request;
        }

        public async Task<ScheduleRequest?> UpdateScheduleRequestAsync(int id, ScheduleRequest updatedRequest)
        {
            if (id != updatedRequest.Id)
            {
                return null; // ID mismatch
            }

            var existingRequest = await _context.ScheduleRequest.FindAsync(id);
            if (existingRequest == null)
            {
                return null; // Not found
            }

            // Actualizează câmpurile necesare
            existingRequest.StudentID = updatedRequest.StudentID;
            existingRequest.SubjectID = updatedRequest.SubjectID;
            existingRequest.ClassroomID = updatedRequest.ClassroomID;
            existingRequest.RequestStateID = updatedRequest.RequestStateID;

            await _context.SaveChangesAsync();
            return existingRequest;
        }

        public async Task<bool> DeleteScheduleRequestAsync(int id)
        {
            var request = await _context.ScheduleRequest.FindAsync(id);
            if (request == null)
            {
                return false;
            }

            _context.ScheduleRequest.Remove(request);
            await _context.SaveChangesAsync();
            return true;
        }

        public bool ScheduleRequestExists(int id)
        {
            return _context.ScheduleRequest.Any(e => e.Id == id);
        }
    }
}
