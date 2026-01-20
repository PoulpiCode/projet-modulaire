FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

# Initialisation du projet
RUN dotnet new console
RUN dotnet add package MongoDB.Driver
COPY Program.cs .
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/runtime:7.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "app.dll"]