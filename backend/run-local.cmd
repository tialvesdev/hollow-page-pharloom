@echo off
rem Sobe a API com o JDK 21 e o Maven de %USERPROFILE%\tools, sem mexer no PATH do sistema.
rem Precisa do Postgres do docker-compose.yml (na raiz) rodando.
setlocal
if not defined JAVA_HOME set "JAVA_HOME=%USERPROFILE%\tools\jdk-21.0.13+9"
set "PATH=%JAVA_HOME%\bin;%USERPROFILE%\tools\apache-maven-3.9.16\bin;%PATH%"
cd /d "%~dp0"
call mvn -q spring-boot:run %*
