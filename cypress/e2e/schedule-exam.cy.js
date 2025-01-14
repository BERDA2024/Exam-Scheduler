describe('Schedule Exam Test', () => {
    it('should login as professor, add availability, and handle schedule requests', () => {
    
        cy.viewport(2560, 1440);


        cy.visit('https://localhost:50733/login');
        cy.wait(1000);
        cy.get('input[name="email"]').type('cristina@usm.ro');
        cy.wait(500);
        cy.get('input[name="password"]').type('Berda123!');
        cy.wait(500);
        cy.contains('Login').click();
        cy.wait(1000);

        cy.url().should('include', '/dashboard');

        cy.contains('Exams Management').click();
        cy.wait(1000);
        cy.get('input[name="startDate"]').type('2025-01-20T08:00');
        cy.wait(500);
        cy.get('input[name="endDate"]').type('2025-01-30T12:00');
        cy.wait(500);
        cy.get('button[type="submit"]').contains('Add Availability').click();
        cy.wait(1000);

        cy.reload();
        cy.wait(3000);

        cy.get('.profile-icon-container .icon-button').click();
        cy.wait(500);
        cy.contains('Logout').click();
        cy.wait(1000);


        cy.visit('https://localhost:50733/login');
        cy.wait(1000);
        cy.get('input[name="email"]').type('alexandru.adochitei@student.usv.ro');
        cy.wait(500);
        cy.get('input[name="password"]').type('Berda123!');
        cy.wait(500);
        cy.contains('Login').click();
        cy.wait(1000);

        cy.url().should('include', '/dashboard');

        cy.contains('Request Exam').click();
        cy.wait(1000);
        cy.get('select[name="Subject"]').select('Ingineria programelor');
        cy.wait(500);
        cy.get('input[name="StartDate"]').type('2025-01-23T14:00');
        cy.wait(500);
        cy.get('input[name="Classroom"]').type('C202');
        cy.wait(500);
        cy.contains('Request Schedule').click();
        cy.wait(1000);

        cy.reload();
        cy.wait(3000);

        cy.get('.profile-icon-container .icon-button').click();
        cy.wait(500);
        cy.contains('Logout').click();
        cy.wait(1000);

        
        cy.visit('https://localhost:50733/login');
        cy.wait(1000);
        cy.get('input[name="email"]').type('cristina@usm.ro');
        cy.wait(500);
        cy.get('input[name="password"]').type('Berda123!');
        cy.wait(500);
        cy.contains('Login').click();
        cy.wait(1000);

        cy.url().should('include', '/dashboard');

        cy.contains('Exams Management').click();
        cy.wait(1000);
        cy.get('li')
            .first() 
            .within(() => {
                cy.contains('Pending').should('be.visible');
                cy.get('textarea[placeholder="Enter reason for rejection..."]').first().should('be.visible').type('La ora 12!');
            });

        cy.wait(1000);

        cy.get('li')
            .first() 
            .within(() => {
            cy.contains('Reject').click(); 
        });

        cy.wait(1000);

        cy.contains('Reject').click();
        cy.wait(1000);

        cy.reload();
        cy.wait(3000);

        cy.get('.profile-icon-container .icon-button').click();
        cy.wait(500);
        cy.contains('Logout').click();
        cy.wait(1000);


        cy.visit('https://localhost:50733/login');
        cy.wait(1000);
        cy.get('input[name="email"]').type('alexandru.adochitei@student.usv.ro');
        cy.wait(500);
        cy.get('input[name="password"]').type('Berda123!');
        cy.wait(500);
        cy.contains('Login').click();
        cy.wait(1000);

        cy.url().should('include', '/dashboard');

        cy.contains('Request Exam').click();
        cy.wait(1000);
        cy.get('select[name="Subject"]').select('Ingineria programelor');
        cy.wait(500);
        cy.get('input[name="StartDate"]').type('2025-01-23T12:00');
        cy.wait(500);
        cy.get('input[name="Classroom"]').type('C202');
        cy.wait(500);
        cy.contains('Request Schedule').click();
        cy.wait(1000);

        cy.reload();
        cy.wait(1000);

        cy.get('.profile-icon-container .icon-button').click();
        cy.wait(500);
        cy.contains('Logout').click();
        cy.wait(1000);


        cy.visit('https://localhost:50733/login');
        cy.wait(1000);
        cy.get('input[name="email"]').type('cristina@usm.ro');
        cy.wait(500);
        cy.get('input[name="password"]').type('Berda123!');
        cy.wait(500);
        cy.contains('Login').click();
        cy.wait(1000);

        cy.url().should('include', '/dashboard');

        cy.contains('Exams Management').click();
        cy.wait(1000);
        cy.contains('Approve').click();
        cy.wait(1000);

        cy.reload();
        cy.wait(1000);

        cy.get('li')
            .first() 
            .within(() => {
                cy.contains('Edit').click();
                cy.wait(1000);
    
                cy.get('select[name="examType"]').select('Moodle');
                cy.wait(500);
                cy.get('input[name="examDuration"]').clear().type('100');
                cy.wait(500);
                cy.get('input[name="startTime"]').clear().type('12:00');
                cy.wait(500);
    
                cy.contains('Save').click();
                cy.wait(1000);
            });

        cy.reload();
        cy.wait(1000);
        
        cy.contains('Calendar').click();
        cy.contains('23').click();
        cy.wait(3000); 

        cy.reload();
        cy.wait(1000);

        cy.get('.profile-icon-container .icon-button').click();
        cy.wait(500);
        cy.contains('Logout').click();
        cy.wait(1000);


        cy.visit('https://localhost:50733/login');
        cy.wait(1000);
        cy.get('input[name="email"]').type('alexandru.adochitei@student.usv.ro');
        cy.wait(500);
        cy.get('input[name="password"]').type('Berda123!');
        cy.wait(500);
        cy.contains('Login').click();
        cy.wait(1000);

        cy.url().should('include', '/dashboard');

        cy.contains('Calendar').click();
        cy.contains('23').click();
        cy.wait(3000); 

        cy.reload();
        cy.wait(1000);

        cy.get('.profile-icon-container .icon-button').click();
        cy.wait(500);
        cy.contains('Logout').click();
        cy.wait(1000);
    });
});
