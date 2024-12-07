using ExamScheduler.Server.Source.DataBase;
using ExamScheduler.Server.Source.Domain;
using ExamScheduler.Server.Source.Models;
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

        // GET: To retrieve all schedule requests
        public async Task<IEnumerable<ScheduleRequestModel>> GetAllScheduleRequestsAsync()
        {
            var scheduleRequests = await _context.ScheduleRequest
                .Select(sr => new ScheduleRequestModel
                {
                    Id = sr.Id,
                    SubjectID = sr.SubjectID,
                    StudentID = sr.StudentID,
                    RequestStateID = sr.RequestStateID,
                    ClassroomID = sr.ClassroomID,
                    StartDate = sr.StartDate
                })
                .ToListAsync();

            return scheduleRequests;
        }

        // GET: To retrieve a schedule request by ID
        public async Task<ScheduleRequestModel> GetScheduleRequestByIdAsync(int id)
        {
            var scheduleRequest = await _context.ScheduleRequest.FindAsync(id);

            if (scheduleRequest == null)
            {
                return null;
            }

            var model = new ScheduleRequestModel
            {
                Id = scheduleRequest.Id,
                SubjectID = scheduleRequest.SubjectID,
                StudentID = scheduleRequest.StudentID,
                RequestStateID = scheduleRequest.RequestStateID,
                ClassroomID = scheduleRequest.ClassroomID,
                StartDate = scheduleRequest.StartDate
            };

            return model;
        }

        // POST: To create a new schedule request
        public async Task<ScheduleRequestModel> CreateScheduleRequestAsync(ScheduleRequestModel model)
        {
            var scheduleRequest = new ScheduleRequest
            {
                SubjectID = model.SubjectID,
                StudentID = model.StudentID,
                RequestStateID = model.RequestStateID,
                ClassroomID = model.ClassroomID,
                StartDate = model.StartDate
            };

            _context.ScheduleRequest.Add(scheduleRequest);
            await _context.SaveChangesAsync();

            model.Id = scheduleRequest.Id;

            return model;
        }

        // PUT: To update an existing schedule request
        public async Task<bool> UpdateScheduleRequestAsync(int id, ScheduleRequestModel model)
        {
            var scheduleRequest = await _context.ScheduleRequest.FindAsync(id);

            if (scheduleRequest == null)
            {
                return false;
            }

            scheduleRequest.SubjectID = model.SubjectID;
            scheduleRequest.StudentID = model.StudentID;
            scheduleRequest.RequestStateID = model.RequestStateID;
            scheduleRequest.ClassroomID = model.ClassroomID;
            scheduleRequest.StartDate = model.StartDate;

            _context.ScheduleRequest.Update(scheduleRequest);
            await _context.SaveChangesAsync();

            return true;
        }

        // DELETE: To delete a schedule request
        public async Task<bool> DeleteScheduleRequestAsync(int id)
        {
            var scheduleRequest = await _context.ScheduleRequest.FindAsync(id);

            if (scheduleRequest == null)
            {
                return false;
            }

            _context.ScheduleRequest.Remove(scheduleRequest);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
