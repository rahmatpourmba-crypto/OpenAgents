@echo off
:: This is the wrapper script that Chrome will execute.
python "%~dp0agent_host.py" %*
