USE [BERDA]
GO

INSERT INTO [dbo].[Department]
           ([LongName]
           ,[ShortName]
           ,[FacultyId])
VALUES
           ('Calculatoare', 'C', 1),
           ('Electronica aplicata', 'EA', 1),
           ('Retele si software de telecomunicatii', 'RST', 1),
           ('Sisteme electrice', 'SE', 1),
           ('Energetica si tehnologii informatice', 'ETI', 1),
           ('Managementul energiei', 'ME', 1),
           ('Automatica si informatica aplicata', 'AIA', 1),
           ('Echipamente si sisteme de comanda si control pentru autovehicule', 'ESCCA', 1),
           ('Echipamente si sisteme medicale', 'ESM', 1);
GO