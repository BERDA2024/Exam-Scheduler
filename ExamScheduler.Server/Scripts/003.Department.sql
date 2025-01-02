USE [BERDA]
GO

INSERT INTO [dbo].[Department]
           ([LongName]
           ,[ShortName]
           ,[FacultyId])
VALUES
           ('Calculatoare', 'C', 1),
           ('Electronică aplicată', 'EA', 1),
           ('Reţele şi software de telecomunicaţii', 'RST', 1),
           ('Sisteme electrice', 'SE', 1),
           ('Energetică și tehnologii informatice', 'ETI', 1),
           ('Managementul energiei', 'ME', 1),
           ('Automatică și informatică aplicată', 'AIA', 1),
           ('Echipamente și sisteme de comandă și control pentru autovehicule', 'ESCCA', 1),
           ('Echipamente şi sisteme medicale', 'ESM', 1);
GO