FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app

ARG ConnectionStrings__Budgeter
ENV ConnectionStrings__Budgeter=$ConnectionStrings__Budgeter
ARG ClientHostName
ENV ClientHostName=$ClientHostName

COPY ./Api.csproj ./
RUN dotnet restore

COPY ./ ./
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "Api.dll"]