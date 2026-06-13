@echo off
setlocal
REM Lightweight Maven bootstrapper for Windows
REM Downloads Apache Maven into .mvn if not present and runs it
set SCRIPT_DIR=%~dp0
set MAVEN_VERSION=3.8.6
set MAVEN_DIR=%SCRIPT_DIR%\.mvn\apache-maven-%MAVEN_VERSION%
if not exist "%MAVEN_DIR%\bin\mvn.cmd" (
  echo Maven not found locally. Downloading Apache Maven %MAVEN_VERSION%...
  powershell -Command "try { Invoke-WebRequest -Uri 'https://downloads.apache.org/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile '$env:TEMP\\maven.zip' -UseBasicParsing } catch { Write-Error \"Download failed\"; exit 1 }"
  powershell -Command "Expand-Archive -Path '$env:TEMP\\maven.zip' -DestinationPath '%SCRIPT_DIR%\.mvn' -Force"
  if exist "%TEMP%\maven.zip" del "%TEMP%\maven.zip"
)
"%MAVEN_DIR%\bin\mvn.cmd" %*
